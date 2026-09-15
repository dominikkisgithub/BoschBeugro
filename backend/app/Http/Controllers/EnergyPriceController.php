<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class EnergyPriceController extends Controller
{
public function getPrices()
    {
        $response = Http::get('https://api.energy-charts.info/v2/price?bzn=HU');

        if ($response -> failed()) {
            return response() -> json(['error' => 'Nem sikerült lekérni az árakat.']);
        }

        $data = $response -> json();

        $processedPrices = [];
        
        for ($i = 0; $i < count($data["data"]); $i++)
        {
            
            $timestamp = $data["data"][$i]["timestamp"];

            $eurMWh = $data["data"][$i]["values"]["day_ahead_price"];
            
            $hufKWh = ($eurMWh * 1000) * 380;

            $processedPrices[] = [
                'timestamp' => $timestamp,
                'price_huf_kwh' => $hufKWh
            ];

        }

        return response()->json($processedPrices);
    }
}
