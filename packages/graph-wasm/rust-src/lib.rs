use std::sync::atomic::Ordering;
use antv_graph::prelude::*;
use js_sys::Array;
use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

#[cfg(feature = "parallel")]
pub use wasm_bindgen_rayon::init_thread_pool;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

#[derive(Serialize, Deserialize)]
pub struct PageRankParams {
    pub max_iterations: usize,
    pub tolerance: f64,
    pub damping_factor: f32,
    pub edgelist: Vec<(usize, usize)>,
}

#[wasm_bindgen(js_name = "pageRank")]
pub fn page_rank(val: JsValue) -> Array {
    let options: PageRankParams = serde_wasm_bindgen::from_value(val).unwrap();

    let graph: DirectedCsrGraph<usize> = GraphBuilder::new()
        .edges(options.edgelist)
        .build();

    let (ranks, _, _) = antv_graph::prelude::page_rank(
        &graph,
        PageRankConfig::new(
            options.max_iterations,
            options.tolerance,
            options.damping_factor,
        ),
    );

    // @see https://stackoverflow.com/a/58996628
    ranks.into_iter().map(JsValue::from).collect()
}

#[derive(Serialize, Deserialize)]
pub struct SSSPParams {
    pub start_node: usize,
    pub delta: f32,
    pub edgelist: Vec<(usize, usize, f32)>,
}

#[wasm_bindgen(js_name = "sssp")]
pub fn sssp(val: JsValue) -> Array {
    let options: SSSPParams = serde_wasm_bindgen::from_value(val).unwrap();

    let graph: DirectedCsrGraph<usize, (), f32> = GraphBuilder::new().edges_with_values(options.edgelist).build();
    let config = DeltaSteppingConfig::new(options.start_node, options.delta);
    let result: Vec<f32> = antv_graph::prelude::delta_stepping(&graph, config).into_iter()
        .map(|d| d.load(Ordering::Relaxed))
        .collect();
    result.into_iter().map(JsValue::from).collect()
}
