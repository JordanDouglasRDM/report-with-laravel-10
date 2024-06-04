<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RequesterController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('auth.login');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware('level:admin')->group(function () {
    Route::get('/user/get', [UserController::class, 'getAll']);
    Route::resource('/user', UserController::class);
});

Route::middleware('level:admin,operator')->group(function () {
    Route::get('/department/get', [DepartmentController::class, 'getAll']);
    Route::resource('/department', DepartmentController::class);
    Route::get('/requester/get', [RequesterController::class, 'getAll']);
    Route::resource('/requester', RequesterController::class);

    Route::get('/report/get', [ReportController::class, 'getAll']);
    Route::get('/report/gty/report/get', [ReportController::class, 'getQtyReports']);
    Route::resource('/report', ReportController::class);
});


require __DIR__ . '/auth.php';
