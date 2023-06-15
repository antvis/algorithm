use antv_graph::prelude::*;
use js_sys::Array;
use wasm_bindgen::prelude::*;

#[cfg(feature = "parallel")]
pub use wasm_bindgen_rayon::init_thread_pool;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen(js_name = "pageRank")]
pub fn page_rank(val: JsValue) -> Array {
    let options: PageRankConfig = serde_wasm_bindgen::from_value(val).unwrap();

    let graph: DirectedCsrGraph<usize> = GraphBuilder::new()
        .edges(vec![
            (1, 2),  // B->C
            (2, 1),  // C->B
            (4, 0),  // D->A
            (4, 1),  // D->B
            (5, 4),  // E->D
            (5, 1),  // E->B
            (5, 6),  // E->F
            (6, 1),  // F->B
            (6, 5),  // F->E
            (7, 1),  // G->B
            (7, 5),  // F->E
            (8, 1),  // G->B
            (8, 5),  // G->E
            (9, 1),  // H->B
            (9, 5),  // H->E
            (10, 1), // I->B
            (10, 5), // I->E
            (11, 5), // J->B
            (12, 5), // K->B
        ])
        .build();

    let (ranks, iterations, _) = antv_graph::prelude::page_rank(
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
