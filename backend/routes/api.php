<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EnergyPriceController;
use App\Http\Controllers\TimeBlockController;
use App\Http\Middleware\CheckToken;

Route::middleware([CheckToken::class])->group(function () {
    Route::get("/prices", [EnergyPriceController::class, "getPrices"]);

    Route::get("/time-blocks", [TimeBlockController::class, "index"]);
    Route::post("/time-blocks", [TimeBlockController::class, "store"]);
});
