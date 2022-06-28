use wasm_bindgen::prelude::*;
use std::cmp;

#[wasm_bindgen]
pub struct Grid {
    grid: [u8; 9],
    winning_combinations: [[u8; 3]; 8],
}

#[wasm_bindgen]
impl Grid {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Grid {
        Grid {
            grid: [0; 9],
            winning_combinations: [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ]
        }
    }

    pub fn get(&self, i: usize) -> u8 {
        self.grid[i]
    }

    pub fn set(&mut self, i: usize, v: u8) {
        self.grid[i] = v;
    }

    pub fn is_game_over(&self) -> u8 {
        if self.winning_combinations.iter().any(
            |&w| 
            self.grid[w[0] as usize] == 1 && 
            self.grid[w[1] as usize] == 1 && 
            self.grid[w[2] as usize] == 1
        ) { 
            1 // Player win
        } else if self.winning_combinations.iter().any(
            |&w| 
            self.grid[w[0] as usize] == 2 && 
            self.grid[w[1] as usize] == 2 && 
            self.grid[w[2] as usize] == 2
        ) {
            3 // AI win
        } else if self.grid.iter().all(|&x| x > 0) {
            2 // Draw
        } else {
            0 // Not game over
        }
    }

    pub fn minimax(&mut self, mut alpha: u8, mut beta: u8, is_maximizing_player: bool) -> u8 {
        let mut eval = self.is_game_over();
        if eval != 0 {
            return eval;
        }
        
        if is_maximizing_player {
            let mut max_eval = 0;
            
            for i in 0..9 {
                if self.grid[i] == 0 {
                    self.grid[i] = 2;
                    eval = self.minimax(alpha, beta, false);
                    self.grid[i] = 0;
                    max_eval = cmp::max(max_eval, eval);
                    alpha = cmp::max(alpha, eval);
                    if beta <= alpha {
                        break;
                    }
                }    
            }
            
            return max_eval;
        } else {
            let mut min_eval = 4;
            
            for i in 0..9 {
                if self.grid[i] == 0 {
                    self.grid[i] = 1;
                    eval = self.minimax(alpha, beta, true);
                    self.grid[i] = 0;
                    min_eval = cmp::min(min_eval, eval);
                    beta = cmp::min(beta, eval);
                    if beta <= alpha {
                        break;
                    }
                }    
            }
            
            return min_eval;
        }
    }

    pub fn reset(&mut self) {
        self.grid = [0; 9];
    }
}