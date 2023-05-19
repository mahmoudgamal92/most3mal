<?php

use App\Notifications\BidNotification;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Orbscope\Controllers\UploadFiles as Upload;
use App\Orbscope\Models\Ad;
use App\Orbscope\Models\Ads_service;
use App\Orbscope\Models\Auction;
use App\Orbscope\Models\Category;
use App\Orbscope\Models\Offer;
use App\Orbscope\Models\OnlinePayment;
use App\Orbscope\Models\Order;
use App\Orbscope\Models\Payment;
use App\Orbscope\Models\Review;
use App\Orbscope\Models\SubCategory;
use App\Orbscope\Models\Wishlist;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//auth apis
//login route
Route::post('/user/login','UserController@login');

//register route
Route::post('/user/new_register','UserController@newUser');

//banners route
Route::get('/get-banners','MainController@getBanners');
//How_does_work route
Route::get('/How_does_work/{lang}','MainController@HowDoesWork');
//How_does_work route
Route::get('/uses/{lang}','MainController@uses');
//protected routes
Route::middleware('auth:api')->group(function () {

    //chat
    Route::get('/get_chats','MainController@users_chating');
    Route::get('/chatprivate/{id}','MainController@getMessages');
    Route::get('/contact/{id}','MainController@add_contact');
    Route::post('/send-message','MainController@sendMessage');
    //get user profile
    Route::get('/user/profile', function (Request $request) {
        return $request->user();
    });
    //get user profile
    Route::post('/user/profile/update', function (Request $request) {
        $user = $request->user();
        $rules = [
            'name' => 'required|string|min:3',
            // 'email' => 'required|email',
            'phone' => 'required|min:8',
            // 'password' => 'nullable|string|min:6|confirmed',
            'lang' => 'nullable',
            'whats_app' => 'nullable',
            'image' => 'nullable',
            'about' => 'nullable',
            'identy_id' => 'nullable',
            'address' => 'nullable',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json($validator->messages());
        } else {

            $user->name           = $request->input('name');
            // $user->email          = $request->input('email');
            $user->phone          = $request->input('phone');
            $user->lang          = $request->input('lang');
            $user->whats_app          = $request->input('whats_app');
            $user->about          = $request->input('about');
            $user->identy_id          = $request->input('identy_id');
            $user->address          = $request->input('address');
            // if ($request->input('password') != '') {
            //     $user->password       = bcrypt($request->input('password'));
            // }
            if ($request->image != '') {
                $uploaded_image  = Upload::uploadImages('agents', $request->image, 'checkImages');
                if ($uploaded_image == 'false') {
                    return response()->json(['status' => 'false', 'msg' => 'image upload error']);
                } else {
                    $user->image = $uploaded_image;
                }
            }
            $user->save();

            return response()->json(
                ['status' => true]
            );
            // session()->flash('success', trans('orbscope.success'));
            // return redirect()->back();
        }
    });

    //reset password
    Route::post('/user/reset-password', function (Request $request) {
        $request->validate([
            'old_password' => 'required|min:6',
            'password' => 'required|min:6',
            'password_confirmation' => 'required|min:6',
        ]);

        if (Hash::check($request->old_password, $request->user()->password)) {
            $request->user()->update([
                'password' => Hash::make($request->password)
            ]);

            return response()->json([
                'status' => true,
            ]);
        }

        return response()->json([
            'status' => false,
        ]);
    });

    Route::post('/user/forget-password', function (Request $request) {
        // $request->validate([
        //     'email' => 'required|email|exists:users',
        // ]);

        $rules = [
            'email' => 'required|email|exists:users',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->SetAttributeNames([
            'email'         => trans('orbscope.email'),
        ]);
        if ($validator->fails()) {
            // return back()->withInput()->withErrors($validator);
            return response()->json([
                'status' => false,
                'msg' => 'please enter valid email',
            ]);
        }

        $token = Str::random(64);

        DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        Mail::send('auth.emails.password', ['token' => $token], function ($message) use ($request) {
            $message->to($request->email);
            $message->subject('Reset Password');
        });
        // session()->flash('message_reset_send', trans('orbscope.success'));
        // return redirect()->back();
        return response()->json([
            'status' => true,
            'msg' => trans('orbscope.success'),
        ]);
    });

    Route::post('/user/delete-account', function (Request $request) {
        $request->user()->delete();
        return response()->json([
            'status' => true,
        ]);
    });

    //create auction
    Route::post('auction/create', function (Request $request) {
        // $validatedData = $request->validate([
        //     'title' => 'required',
        //     'details' => 'required',
        //     'duration' => 'required',
        //     'state_id' => 'required',
        //     'city_id' => 'required',
        //     'address' => 'required',
        //     'images' => 'required',
        // ]);
        $rules = [
            'title'    => 'required',
            'details'    => 'required',
            'duration'    => 'required',
            'country_id'    => 'required',
            'city_id'    => 'required',
            'images'    => 'required',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->SetAttributeNames([
            'title'  => trans('orbscope.title'),
            'details'  => trans('orbscope.details'),
            'duration'  => trans('orbscope.duration'),
            'country_id'  => trans('orbscope.country'),
            'city_id'  => trans('orbscope.city'),
            'images'  => trans('orbscope.images'),
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages());
        } else {
            $date = Carbon::now();
            $start = Carbon::now()->format('Y-m-d H:i:s');
            $end = $date->addDay($request->duration)->format('Y-m-d H:i:s');
            $new = new Auction();
            $new->user_id                  = auth()->user()->id;
            $new->auction_number             = generateBarcodeNumber();
            $new->title                        = $request->title;
            $new->details                     = $request->details;
            $new->duration                     = $request->duration;
            $new->state_id                     = $request->country_id;
            $new->city_id                     = $request->city_id;
            $new->start_date                     = $start;
            $new->end_date                     = $end;
            $new->time                     = strtotime($end);
            $new->address                     = $request->address;

            $images                  = $request->file('images');
            if (!empty($images) && $images != '') {
                foreach ($images as $img) {
                    $uploadedImages[]     = Upload::uploadImages('auction', $img, 'checkImages', 'false');
                }
                if ($uploadedImages == 'false') {
                    return response()->json([
                        'status' => false,
                        'msg' => 'cannot upload image'
                    ]);
                } else {
                    $new->main_image       = $uploadedImages[0];
                    $project_imgs = implode('|', $uploadedImages);
                    $new->images       = $project_imgs;
                }
            }

            $new->save();
            return response()->json([
                'status' => true,
                'msg' => 'auction created successfully'
            ]);
        }
    });

    //create real state ad
    Route::post('ad/real-state/create', function (Request $request) {
        $rules = [
            'title'         => 'required|min:10',
            'Category'     => 'nullable|exists:categories,id',
            'subcat'     => 'nullable|exists:sub_categories,id',
            'country_id'     => 'required|exists:countries,id',
            'city_id'     => 'required|exists:cities,id',
            'price'        => 'required',
            'service' => 'array',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->SetAttributeNames([
            'title'       => trans('orbscope.title'),
            'country_id'      => trans('orbscope.country'),
            'city_id'   => trans('orbscope.city'),
            'price'   => trans('orbscope.price'),
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages());
        } else {

            $new = new Ad();
            $new->user_id                  = auth()->user()->id;
            $new->ad_number             = generateBarcodeNumber();
            $new->title                 = $request->title;
            $new->details                = $request->details;
            $new->price                  = $request->price;
            $new->state_id                = $request->country_id;
            if (isset($request->Category)) {

                $cat = Category::findOrFail($request->Category);

                $new->cat_id                  = $request->Category;
                $new->depart_id                  = $cat->depart_id;
            } elseif (isset($request->subcat)) {

                $sub = SubCategory::findOrFail($request->subcat);
                $new->cat_id                   = $sub->cat_id;
                $new->depart_id                  = $sub->depart_id;
                $new->subcat_id                  = $request->subcat;
            }
            $new->city_id                  = $request->city_id;
            $new->age                      = $request->age;
            $new->surface_area              = $request->surface_area;
            $new->number_halls               = $request->number_halls;
            $new->number_bathrooms           = $request->number_bathrooms;
            $new->bedrooms                     = $request->bedrooms;
            $new->address                     = $request->address;

            $images                  = $request->file('images');
            if (!empty($images) && $images != '') {
                foreach ($images as $img) {
                    $uploadedImages[]     = Upload::uploadImages('projects', $img, 'checkImages', 'false');
                }
                if ($uploadedImages == 'false') {
                    return response()->json([
                        'status' => false,
                        'msg' => 'cannot upload image'
                    ]);
                } else {
                    $new->main_image       = $uploadedImages[0];
                    $project_imgs = implode('|', $uploadedImages);
                    $new->images       = $project_imgs;
                }
            }

            $new->save();

            if (!empty($request->service) && $request->service != null) {
                foreach ($request->service as $key => $s) {

                    $service = new Ads_service();
                    $service->ad_id = $new->id;
                    $service->service_id = $s;
                    $service->save();
                }
            }

            return response()->json([
                'status' => true,
                'msg' => 'ad added successfully'
            ]);
        }
    });

    //create car_ad
    Route::post('ad/car/create', function (Request $request) {

        $rules = [
            'title'         => 'required|min:10',
            'country_id'     => 'required',
            'city_id'        => 'required',
            'price'        => 'required',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->SetAttributeNames([
            'title'       => trans('orbscope.title'),
            'country_id'      => trans('orbscope.country'),
            'city_id'   => trans('orbscope.city'),
            'price'   => trans('orbscope.price'),
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages());
        } else {


            $new = new Ad();
            $new->user_id                  = auth()->user()->id;
            $new->ad_number             = generateBarcodeNumber();
            $new->title                 = $request->title;
            $new->details                = $request->details;
            $new->price                  = $request->price;
            $new->state_id                = $request->country_id;
            if (isset($request->Category)) {

                $cat = Category::findOrFail($request->Category);

                $new->cat_id                  = $request->Category;
                $new->depart_id                  = $cat->depart_id;
            } elseif (isset($request->subcat)) {

                $sub = SubCategory::findOrFail($request->subcat);
                $new->cat_id                   = $sub->cat_id;
                $new->depart_id                  = $sub->depart_id;
                $new->subcat_id                  = $request->subcat;
            }
            $new->city_id                  = $request->city_id;
            $new->car_type                  = $request->car_conditions;
            $new->seats_number                      = $request->seats;
            $new->car_gear                    = $request->car_gear;
            $new->engine_type              = $request->engine_type;
            $new->drive_system                     = $request->drive_system;
            $new->model                     = $request->model;
            $new->address                     = $request->address;

            $images                  = $request->file('images');
            if (!empty($images) && $images != '') {
                foreach ($images as $img) {
                    $uploadedImages[]     = Upload::uploadImages('projects', $img, 'checkImages', 'false');
                }
                if ($uploadedImages == 'false') {
                    return response()->json([
                        'status' => false,
                        'msg' => 'cant upload images'
                    ]);
                } else {
                    $new->main_image       = $uploadedImages[0];
                    $project_imgs = implode('|', $uploadedImages);
                    $new->images       = $project_imgs;
                }
            }

            $new->save();


            return response()->json([
                'status' => true,
                'msg' => 'ad added successfully'
            ]);
        }
    });
    // create ad
    Route::post('ad/create', function (Request $request) {
        $rules = [
            'title'         => 'required|min:10',
            'country_id'     => 'required',
            'city_id'        => 'required',
            'price'        => 'required',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->SetAttributeNames([
            'title'       => trans('orbscope.title'),
            'country_id'      => trans('orbscope.country'),
            'city_id'   => trans('orbscope.city'),
            'price'   => trans('orbscope.price'),
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages());
        } else {
            $new = new Ad();
            $new->user_id                  = auth()->user()->id;
            $new->ad_number             = generateBarcodeNumber();
            $new->title                 = $request->title;
            $new->details                = $request->details;
            $new->price                  = $request->price;
            $new->state_id                = $request->country_id;
            if (isset($request->Category)) {

                $cat = Category::findOrFail($request->Category);

                $new->cat_id                  = $request->Category;
                $new->depart_id                  = $cat->depart_id;
            } elseif (isset($request->subcat)) {

                $sub = SubCategory::findOrFail($request->subcat);
                $new->cat_id                   = $sub->cat_id;
                $new->depart_id                  = $sub->depart_id;
                $new->subcat_id                  = $request->subcat;
            }
            $new->city_id                  = $request->city_id;
            $new->address                     = $request->address;

            $images                  = $request->file('images');
            if (!empty($images) && $images != '') {
                foreach ($images as $img) {
                    $uploadedImages[]     = Upload::uploadImages('projects', $img, 'checkImages', 'false');
                }
                if ($uploadedImages == 'false') {
                    return response()->json([
                        'status' => false,
                        'msg' => 'cant upload images'
                    ]);
                } else {
                    $new->main_image       = $uploadedImages[0];
                    $project_imgs = implode('|', $uploadedImages);
                    $new->images       = $project_imgs;
                }
            }

            $new->save();


            return response()->json([
                'status' => true,
                'msg' => 'ad added successfully'
            ]);
        }
    });


    // update user ads
    Route::post('user/ads/{id}/update', function (Request $request, $id) {
        // dd($id);
        $request->validate([
            'title'         => 'required|min:10',
            'country_id'     => 'required',
            'city_id'        => 'required',
            'price'        => 'required',
        ]);
        try {
            $ad = Ad::findOrFail($id);
            $ad->user_id                  = auth()->user()->id;
            // $ad->ad_number             = generateBarcodeNumber();
            $ad->title                 = $request->title;
            $ad->details                = $request->details;
            $ad->price                  = $request->price;
            $ad->state_id                = $request->country_id;
            if (isset($request->Category)) {

                $cat = Category::findOrFail($request->Category);

                $ad->cat_id                  = $request->Category;
                $ad->depart_id                  = $cat->depart_id;
            } elseif (isset($request->subcat)) {

                $sub = SubCategory::findOrFail($request->subcat);
                $ad->cat_id                   = $sub->cat_id;
                $ad->depart_id                  = $sub->depart_id;
                $ad->subcat_id                  = $request->subcat;
            }
            $ad->city_id                  = $request->city_id;
            //car
            $ad->car_type                  = $request->car_conditions ?? null;
            $ad->seats_number                      = $request->seats ?? null;
            $ad->car_gear                    = $request->car_gear ?? null;
            $ad->engine_type              = $request->engine_type ?? null;
            $ad->drive_system                     = $request->drive_system ?? null;
            $ad->model                     = $request->model ?? null;
            //real estate
            $ad->age                      = $request->age ?? null;
            $ad->surface_area              = $request->surface_area ?? null;
            $ad->number_halls               = $request->number_halls ?? null;
            $ad->number_bathrooms           = $request->number_bathrooms ?? null;
            $ad->bedrooms                     = $request->bedrooms ?? null;
            $ad->address                   = $request->address ?? null;
            $ad->save();
            return response()->json([
                'status' => true,
                'msg' => 'ad updated successfully',
            ]);
        } catch (\Throwable $th) {
            // return $th;
            return response()->json([
                'status' => false,
                'msg' => 'cannot update ad',
            ]);
        }
    });
    // update user auction
    Route::post('user/auctions/{id}/update', function (Request $request, $id) {
        // dd($id);
        $request->validate([
            'title'    => 'required',
            'details'    => 'required',
            'duration'    => 'required',
            'country_id'    => 'required',
            'city_id'    => 'required',
            'images'    => 'required',
        ]);
        try {
            $date = Carbon::now();
            $start = Carbon::now()->format('Y-m-d H:i:s');
            $end = $date->addDay($request->duration)->format('Y-m-d H:i:s');
            $ad = Auction::findOrFail($id);
            $ad->user_id                  = auth()->user()->id;
            // $ad->auction_number             = generateBarcodeNumber();
            $ad->title                        = $request->title;
            $ad->details                     = $request->details;
            $ad->duration                     = $request->duration;
            $ad->state_id                     = $request->country_id;
            $ad->city_id                     = $request->city_id;
            $ad->start_date                     = $start;
            $ad->end_date                     = $end;
            $ad->time                     = strtotime($end);
            $ad->address                     = $request->address;



            $ad->save();
            return response()->json([
                'status' => true,
                'msg' => 'auction updated successfully'
            ]);
        } catch (\Throwable $th) {
            // return $th;
            return response()->json([
                'status' => false,
                'msg' => 'cannot update auction',
            ]);
        }
    });

    Route::post('user/auctions/{id}/add_offer', function ($id, Request $request) {
        $rules = [
            'amount'    => 'required|numeric',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->SetAttributeNames([
            'amount'  => trans('orbscope.amount_money'),

        ]);
        try {
            //code...
            $aucto = Auction::findOrFail($id);
            $new = new Offer();
            $new->user_id = auth()->id();
            $new->amount = $request->amount;
            $new->auction_id = $id;
            $new->save();
            $ar_message = 'تم اضافة عرض جديد علي مزاد' . ' ' . $aucto->title . '  ';
            $en_massage = 'new offer on auction' . ' ' . $aucto->title;
            $url = 'auction/' . $aucto->id . '/' . $aucto->title;
            $user = User::find($aucto->user_id);
            $user->notify(new BidNotification($ar_message, $en_massage, $url));

            // session()->flash('success', trans('orbscope.success'));
            // return redirect()->back();
            return response()->json([
                'status' => true,
                'msg' => 'Offer Created Successfully!',
            ]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'status' => false,
                'msg' => 'cannot create offer',
            ]);
        }
    });


    //update ad images
    Route::post('user/ads/{id}/images/update', function (Request $request, $id) {
        $request->validate(['images' => 'required']);
        $ad = Ad::findOrFail($id);
        $images                  = $request->file('images');
        if (!empty($images) && $images != '') {
            foreach ($images as $img) {
                $uploadedImages[]     = Upload::uploadImages('projects', $img, 'checkImages', 'false');
            }
            if ($uploadedImages == 'false') {
                return response()->json([
                    'status' => false,
                    'msg' => 'cant upload images'
                ]);
            } else {
                $ad->main_image       = $uploadedImages[0];
                $project_imgs = implode('|', $uploadedImages);
                $ad->images       = $project_imgs;
                $ad->save();
                return response()->json([
                    'status' => true,
                    'msg' => 'ad images updated successfully',
                ]);
            }
        }
    });
    //update auction images
    Route::post('user/auctions/{id}/images/update', function (Request $request, $id) {
        $request->validate(['images' => 'required']);
        $ad = Ad::findOrFail($id);
        $images                  = $request->file('images');
        if (!empty($images) && $images != '') {
            foreach ($images as $img) {
                $uploadedImages[]     = Upload::uploadImages('auction', $img, 'checkImages', 'false');
            }
            if ($uploadedImages == 'false') {
                return response()->json([
                    'status' => false,
                    'msg' => 'cant upload images'
                ]);
            } else {
                $ad->main_image       = $uploadedImages[0];
                $project_imgs = implode('|', $uploadedImages);
                $ad->images       = $project_imgs;
                $ad->save();
                return response()->json([
                    'status' => true,
                    'msg' => 'ad images updated successfully',
                ]);
            }
        }
    });
    // delete user ad
    Route::post('user/ads/{id}/delete', function ($id) {
        $ad = \App\Orbscope\Models\Ad::findOrFail($id);
        try {
            $ad->delete();
            return response()->json([
                'status' => true,
                'msg' => 'ad deleted successfully',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'msg' => 'cannot delete ad',
            ]);
        }
    });
    // delete user auction
    Route::post('user/auctions/{id}/delete', function ($id) {
        $auction = \App\Orbscope\Models\Auction::findOrFail($id);
        try {
            $auction->delete();
            return response()->json([
                'status' => true,
                'msg' => 'auction deleted successfully',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'msg' => 'cannot delete auction',
            ]);
        }
    });
    // get user ads
    Route::get('user/ads', function () {
        $countries = \App\Orbscope\Models\Ad::with(['state', 'city', 'depart', 'category', 'subCategory'])->where('user_id', auth()->user()->id)->get();
        return $countries;
    });
    // get user ads orders
    Route::get('user/ads/orders', function () {
        $countries = \App\Orbscope\Models\Order::with(['owner', 'review', 'seller', 'ad'])->where('user_id', auth()->user()->id)->get();
        return $countries;
    });
    Route::get('user/ads/orders/{id}', function ($id) {
        $order = Order::findOrFail($id);
        return $order;
    });
    // get user wishlist ads
    Route::get('user/ads/wishlist', function () {
        $countries = \App\Orbscope\Models\Wishlist::with(['ad'])->where('user_id', auth()->user()->id)->get();
        return $countries;
    });
    // add wishlist
    Route::post('user/add_wishlist', function (Request $request) {
        try {
            //code...
            $wishlist = new Wishlist();
            $wishlist->user_id = auth()->user()->id;
            $wishlist->ad_id = $request->ad_id;
            $wishlist->save();

            return response()->json([
                'status' => true,
                'msg' => 'added to wishlist successfully',
            ]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'status' => false,
                'msg' => 'cant add to wishlist',
            ]);
        }
    });

    // get user balance
    Route::get('user/balance', function () {
        return user_balance();
    });
    // get user suspended_balance
    Route::get('user/suspended_balance', function () {
        return suspended_balance();
    });
    // get user transactions
    Route::get('user/transactions', function () {
        $payment = Payment::with('order')->where('user_id', auth()->user()->id)->orWhere('reciver_id', auth()->user()->id)->get();
        $online = OnlinePayment::where('user_id', auth()->user()->id)->get();
        //$mergedCollection = $online->concat($payment)->sortBy('created_at');
        $all = $payment->merge($online);
        $all = array_reverse(array_sort($all, function ($value) {
            return $value['created_at'];
        }));

        return $all;
    });
    // get user auctions
    Route::get('user/auctions', function () {
        $countries = \App\Orbscope\Models\Auction::with(['state', 'city'])->where('user_id', auth()->user()->id)->get();
        return $countries;
    });
    // get user auctions count
    Route::get('user/active_auctions_count', function () {
        $countries = \App\Orbscope\Models\Auction::where('user_id', auth()->user()->id)->where('status', 'active')->count();
        return $countries;
    });

    // add new order
    Route::get('user/ads/{id}/new-order', function ($id) {
        $ad = Ad::findOrFail($id);
        if ($ad->price <= user_balance()) {
            $new = new Order();
            $new->order_number  = generateOrderNumber();
            $new->user_id = auth()->id();
            $new->seller_id = $ad->user_id;
            $new->ad_id = $ad->id;
            $new->amount = $ad->price;
            $new->save();

            $ra = $ad->price * GetSettings()->commission / 100;
            $net = $ad->price - $ra;

            //dd($net);

            $buy = new Payment();
            $buy->pay_number = generatePaymentNumber();
            $buy->user_id = auth()->id();
            $buy->reciver_id = $ad->user_id;
            $buy->order_id = $new->id;
            $buy->amount = $ad->price;
            $buy->net = $net;
            $buy->status = 'pending';
            $buy->save();

            $ad->status = 'done';
            $ad->save();

            $ar_message = 'لديك طلب شراء قيد التنفيذ برقم' . ' ' . $new->order_number . '  ';
            $en_massage = 'You have a pending purchase order number' . ' ' . $new->order_number;
            $url = 'user/orders/' . $new->id . '/' . $new->order_number;
            $user = User::find($new->seller_id);
            $user->notify(new BidNotification($ar_message, $en_massage, $url));
            // session()->flash('success', trans('orbscope.success'));
            // return redirect('user/orders/' . $new->id . '/' . $new->order_number);
            return response()->json([
                'status' => true,
                'msg' => 'order created successfully',
            ]);
        } else {
            // session()->flash('noblance', trans('front.noblance'));
            // return redirect()->back();
            return response()->json([
                'status' => false,
                'msg' => 'insufficient balance',
            ]);
        }
    });
    //receive order
    Route::get('orders/{id}/order_received', function ($id) {
        if (Auth::check()) {
            $order = Order::findOrFail($id);
            if ($order->user_id == auth()->id()) {
                $order->status = 'done';
                $order->save();
                $finish = Carbon::now()->addDay(4);
                $buy = Payment::where('order_id', $order->id)->first();
                $buy->status = 'done';
                $buy->time = strtotime($finish);
                $buy->save();
                $ar_message = 'تهانينا قام المشتري بااستلام المنتج الخاص بالطلب رقم' . ' ' . $order->order_number . '  ';
                $en_massage = 'Congratulations, the buyer has received the product of order No.' . ' ' . $order->order_number;
                $url = 'user/orders/' . $order->id . '/' . $order->order_number;
                $user = User::find($order->seller_id);
                $user->notify(new BidNotification($ar_message, $en_massage, $url));
                // session()->flash('success', trans('orbscope.success'));
                // return redirect()->back();
                return response()->json([
                    'status' => true,
                    'msg' => 'order received successfully',
                ]);
            } else {

                return response()->json([
                    'status' => false,
                    'msg' => 'order cannot be received',
                ]);
            }
        } else {
            return response()->json([
                'status' => false,
                'msg' => 'order cannot be received',
            ]);
        }
    });
    //cancel order
    Route::get('orders/{id}/order_cancelled', function ($id) {
        if (Auth::check()) {
            $order = Order::findOrFail($id);
            if ($order->user_id == auth()->id()) {
                $order->status = 'canceled';
                $order->save();
                $buy = Payment::where('order_id', $order->id)->first();
                $buy->status = 'cancel';
                $buy->save();
                $ar_message = 'للاسف تم الغاء الطلب رقم' . ' ' . $order->order_number . '  ';
                $en_massage = 'Unfortunately, the order number has been cancelled.' . ' ' . $order->order_number;
                $url = 'user/orders/' . $order->id . '/' . $order->order_number;
                $user = User::find($order->seller_id);
                $user->notify(new BidNotification($ar_message, $en_massage, $url));
                $ad = Ad::findOrFail($id);
                $ad->status = 'active';
                $ad->save();
                // session()->flash('success', trans('orbscope.success'));
                // return redirect()->back();
                return response()->json([
                    'status' => true,
                    'msg' => 'order canceled successfully',
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'msg' => 'order cannot be canceled',
                ]);
            }
        } else {
            return response()->json([
                'status' => false,
                'msg' => 'order cannot be canceled',
            ]);
        }
    });

    // add ad review

    Route::post('orders/{id}/add_review', function ($id, Request $request) {
        $order = Order::findOrFail($id);
        if ($order->user_id == auth()->id()) {
            $rules = [
                'rate' => 'required',
                'details' => 'required',
            ];
            $validator = Validator::make($request->all(), $rules);
            $validator->SetAttributeNames([
                'rate'       => trans('front.evaluation'),
                'details'       => trans('front.write_comment'),
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages());
            }
            $re = new Review();
            $re->owner_id = $order->user_id;
            $re->user_id = $order->seller_id;
            $re->order_id = $order->id;
            $re->rate = $request->rate;
            $re->details = $request->details;
            $re->save();
            $ar_message = 'لديك تقييم جديد خاص بالطلب برقم' . ' ' . $order->order_number . '  ';
            $en_massage = 'You have a new evaluation of the order Nu' . ' ' . $order->order_number;
            $url = 'user/orders/' . $order->id . '/' . $order->order_number;
            $user = User::find($order->seller_id);
            $user->notify(new BidNotification($ar_message, $en_massage, $url));
            // session()->flash('success', trans('orbscope.success'));
            // return redirect()->back();
            return response()->json([
                'status' => true,
                'msg' => 'order reviewed successfully',
            ]);
        } else {
            return response()->json([
                'status' => false,
                'msg' => 'cannot review order',
            ]);
        }
    });
});



// Show all States
Route::get('settings', function () {
    $countries = \App\Orbscope\Models\Setting::first();
    return $countries;
});
// Show all States
Route::get('states', function () {
    $countries = \App\Orbscope\Models\Country::all();
    return $countries;
});
// Show all Services
Route::get('services', function () {
    $services = \App\Orbscope\Models\Service::all();
    return $services;
});
// Show all cities
Route::get('cities', function () {
    $city = \App\Orbscope\Models\City::with('city_country')->get();
    return $city;
});
//all _departments
Route::get('departments', function () {
    $shops = \App\Orbscope\Models\Department::all();
    return $shops;
});
// Show all categories
Route::get('categories', function () {
    $shops = \App\Orbscope\Models\Category::with('depart')->get();
    return $shops;
});
//all_sub_category
Route::get('sub_categories', function () {
    $shops = \App\Orbscope\Models\SubCategory::with(['depart', 'category'])->get();
    return $shops;
});

//get user review
Route::get('user/{id}/review', function ($id) {
    $user = \App\User::findOrFail($id);

    return $user->review;
});


//ads part
//get ads with filters
Route::get('/ads', function (Request $request) {
    return \App\Orbscope\Models\Ad::query()
        ->with(['user.review', 'state', 'city', 'depart', 'category', 'subCategory'])
        ->when($request->title, function ($q) use ($request) {
            $q->where('title', 'like', '%' . $request->title . '%');
        })
        ->when($request->depart_id, function ($q) use ($request) {
            $q->where('depart_id', $request->depart_id);
        })
        ->when($request->city_id, function ($q) use ($request) {
            $q->where('city_id', $request->city_id);
        })
        ->when($request->cat_id, function ($q) use ($request) {
            $q->where('cat_id', $request->cat_id);
        })
        ->when($request->subcat_id, function ($q) use ($request) {
            $q->where('subcat_id', $request->subcat_id);
        })
        ->when($request->state_id, function ($q) use ($request) {
            $q->where('state_id', $request->state_id);
        })
        ->get();
});
// Show ads of selected State_id
// Route::get('/state/{id}/ads', function ($id) {
//     $ads = \App\Orbscope\Models\Ad::where('state_id', $id)->orderBy('created_at', 'desc')->get();

//     return $ads;
// });
// Show ads of selected city_id
// Route::get('/city/{id}/ads', function ($id) {
//     $ads = \App\Orbscope\Models\Ad::where('city_id', $id)->orderBy('created_at', 'desc')->get();

//     return $ads;
// });
// Show ads of selected depart_id
// Route::get('/depart/{id}/ads', function ($id) {
//     $ads = \App\Orbscope\Models\Ad::where('depart_id', $id)->orderBy('created_at', 'desc')->get();

//     return $ads;
// });
// Show ads of selected cat_id
// Route::get('/category/{id}/ads', function ($id) {
//     $ads = \App\Orbscope\Models\Ad::where('cat_id', $id)->orderBy('created_at', 'desc')->get();

//     return $ads;
// });
// Show ads of selected sub_cat
// Route::get('/sub_category/{id}/ads', function ($id) {
//     $ads = \App\Orbscope\Models\Ad::where('subcat_id', $id)->orderBy('created_at', 'desc')->get();

//     return $ads;
// });

// show ads of selected state & selected city
// Route::get('/state/{id_state}/city/{id_city}/ads', function ($id_state, $id_city) {
//     $products = \App\Orbscope\Models\Ad::where('state_id', $id_state)
//         ->where('city_id', $id_city)
//         ->orderBy('created_at', 'desc')->get();
//     foreach ($products as $product) {

//         print_r($product['state']['name']);
//     }
//     return $products;
// });
// show ads of selected state & selected depart
// Route::get('/state/{id_state}/department/{id_depart}/ads', function ($id_state, $id_depart) {
//     $products = \App\Orbscope\Models\Ad::where('state_id', $id_state)
//         ->where('depart_id', $id_depart)
//         ->orderBy('created_at', 'desc')->get();
//     foreach ($products as $product) {

//         print_r($product['state']['name']);
//     }
//     return $products;
// });
// show ads of selected state & selected category
// Route::get('/state/{id_state}/category/{id_cat}/ads', function ($id_state, $id_cat) {
//     $products = \App\Orbscope\Models\Ad::where('state_id', $id_state)
//         ->where('cat_id', $id_cat)
//         ->orderBy('created_at', 'desc')->get();
//     foreach ($products as $product) {

//         print_r($product['state']['name']);
//     }
//     return $products;
// });
// show ads of selected city & selected depart
// Route::get('/city/{id_city}/department/{id_depart}/ads', function ($id_city, $id_depart) {
//     $products = \App\Orbscope\Models\Ad::where('city_id', $id_city)
//         ->where('depart_id', $id_depart)
//         ->orderBy('created_at', 'desc')->get();
//     foreach ($products as $product) {

//         print_r($product['state']['name']);
//     }
//     return $products;
// });
// show ads of selected city & selected category
// Route::get('/city/{id_city}/category/{id_cat}/ads', function ($id_city, $id_cat) {
//     $products = \App\Orbscope\Models\Ad::where('city_id', $id_city)
//         ->where('cat_id', $id_cat)
//         ->orderBy('created_at', 'desc')->get();
//     foreach ($products as $product) {

//         print_r($product['state']['name']);
//     }
//     return $products;
// });


//auctions part
//get auctions with filters
Route::get('/auctions', function (Request $request) {
    return \App\Orbscope\Models\Ad::query()
        ->with(['user', 'state', 'city'])
        ->when($request->title, function ($q) use ($request) {
            $q->where('title', 'like', '%' . $request->title . '%');
        })
        ->when($request->city_id, function ($q) use ($request) {
            $q->where('city_id', $request->city_id);
        })
        ->when($request->state_id, function ($q) use ($request) {
            $q->where('state_id', $request->state_id);
        })
        ->get();
});

//show all auctions
// Route::get('auctions', function () {
//     $ads = \App\Orbscope\Models\Auction::where('status', 'active')->orderBy('created_at', 'desc')->get();

//     return $ads;
// });
// Show auctions of selected state
// Route::get('/state/{id}/auctions', function ($id) {
//     $ads = \App\Orbscope\Models\Auction::where('state_id', $id)->orderBy('created_at', 'desc')->get();

//     return $ads;
// });
// Show auctions of selected city
// Route::get('/city/{id}/auctions', function ($id) {
//     $ads = \App\Orbscope\Models\Auction::where('city_id', $id)->orderBy('created_at', 'desc')->get();

//     return $ads;
// });
