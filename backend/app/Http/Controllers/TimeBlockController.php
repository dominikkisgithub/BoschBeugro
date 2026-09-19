<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TimeBlockController extends Controller
{
    public function index()
    {
        $blocks = TimeBlockToHeat::pluck("time_block")->toArray();
        return response()->json($blocks);
    }

    public function store(Request $request)
    {
        $request->validate([
            "time_blocks" => "array",
        ]);

        $timeBlocks = $request->input("time_blocks", []);

        foreach ($timeBlocks as $datetimeStr) {
            TimeBlockToHeat::create([
                "time_block" => $datetimeStr,
            ]);
        }

        return response()->json([
            "message" => "Fűtési időszakok elmentve!",
            "count" => count($timeBlocks)
        ]);
    }
}