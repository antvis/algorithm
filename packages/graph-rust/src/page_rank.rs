use super::graph_builder::{prelude::*, SharedMut};
use crate::DEFAULT_PARALLELISM;

use atomic_float::AtomicF64;
use rayon::prelude::*;

use std::sync::atomic::Ordering;

const CHUNK_SIZE: usize = 16384;

#[derive(Copy, Clone, Debug)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct PageRankConfig {
    /// The maximum number of page rank iterations.
    pub max_iterations: usize,

    /// If the sum of page rank deltas per iteration is
    /// below the tolerance value, the computation stop.
    pub tolerance: f64,

    /// Imagining a random surfer clicking links, the
    /// damping factor defines the probability if the
    /// surfer will continue at any step.
    pub damping_factor: f32,
}

impl Default for PageRankConfig {
    fn default() -> Self {
        Self {
            max_iterations: Self::DEFAULT_MAX_ITERATIONS,
            tolerance: Self::DEFAULT_TOLERANCE,
            damping_factor: Self::DEFAULT_DAMPING_FACTOR,
        }
    }
}

impl PageRankConfig {
    pub const DEFAULT_MAX_ITERATIONS: usize = 1000;
    pub const DEFAULT_TOLERANCE: f64 = 1E-4;
    pub const DEFAULT_DAMPING_FACTOR: f32 = 0.85;

    pub fn new(max_iterations: usize, tolerance: f64, damping_factor: f32) -> Self {
        Self {
            max_iterations,
            tolerance,
            damping_factor,
        }
    }
}

pub fn page_rank<NI, G>(graph: &G, config: PageRankConfig) -> (Vec<f32>, usize, f64)
where
    NI: Idx,
    G: Graph<NI> + DirectedDegrees<NI> + DirectedNeighbors<NI> + Sync,
{
    let PageRankConfig {
        max_iterations,
        tolerance,
        damping_factor,
    } = config;

    let node_count = graph.node_count().index();
    let init_score = 1_f32 / node_count as f32;
    let base_score = (1.0_f32 - damping_factor) / node_count as f32;

    let mut out_scores = Vec::with_capacity(node_count);

    (0..node_count)
        .into_par_iter()
        .map(NI::new)
        .map(|node| init_score / graph.out_degree(node).index() as f32)
        .collect_into_vec(&mut out_scores);

    let mut scores = vec![init_score; node_count];

    let scores_ptr = SharedMut::new(scores.as_mut_ptr());
    let out_scores_ptr = SharedMut::new(out_scores.as_mut_ptr());

    let mut iteration = 0;

    loop {
        let error = page_rank_iteration(
            graph,
            base_score,
            damping_factor,
            &out_scores_ptr,
            &scores_ptr,
        );

        iteration += 1;

        if error < tolerance || iteration == max_iterations {
            return (scores, iteration, error);
        }
    }
}

fn page_rank_iteration<NI, G>(
    graph: &G,
    base_score: f32,
    damping_factor: f32,
    out_scores: &SharedMut<f32>,
    scores: &SharedMut<f32>,
) -> f64
where
    NI: Idx,
    G: Graph<NI> + DirectedDegrees<NI> + DirectedNeighbors<NI> + Sync,
{
    let next_chunk = Atomic::new(NI::zero());
    let total_error = AtomicF64::new(0_f64);

    rayon::scope(|s| {
        let num_threads = DEFAULT_PARALLELISM;

        for _ in 0..num_threads {
            s.spawn(|_| {
                let mut error = 0_f64;

                loop {
                    let start = NI::fetch_add(&next_chunk, NI::new(CHUNK_SIZE), Ordering::AcqRel);
                    if start >= graph.node_count() {
                        break;
                    }

                    let end = (start + NI::new(CHUNK_SIZE)).min(graph.node_count());

                    for u in start.range(end) {
                        let incoming_total = graph
                            .in_neighbors(u)
                            .map(|v| unsafe { out_scores.add(v.index()).read() })
                            .sum::<f32>();

                        let old_score = unsafe { scores.add(u.index()).read() };
                        let new_score = base_score + damping_factor * incoming_total;

                        unsafe { scores.add(u.index()).write(new_score) };
                        let diff = (new_score - old_score) as f64;
                        error += f64::abs(diff);

                        unsafe {
                            out_scores
                                .add(u.index())
                                .write(new_score / graph.out_degree(u).index() as f32)
                        }
                    }
                }
                total_error.fetch_add(error, Ordering::SeqCst);
            });
        }
    });

    total_error.load(Ordering::SeqCst)
}
