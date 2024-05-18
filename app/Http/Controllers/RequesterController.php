<?php

namespace App\Http\Controllers;

use App\Models\Requester;
use App\Http\Requests\StoreRequesterRequest;
use App\Http\Requests\UpdateRequesterRequest;

class RequesterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('requesters');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequesterRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Requester $requester)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Requester $requester)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequesterRequest $request, Requester $requester)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Requester $requester)
    {
        //
    }
}
