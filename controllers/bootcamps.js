const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/errorResponse');

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    console.log(req.query);
    let query;

    const reqQuery = {...req.query};

    const removeFields = ['select','sort','page','limit'];

    removeFields.forEach(param => delete reqQuery[param]);


    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr));

    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        console.log(fields);
        query = query.select(fields);
    }

    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        console.log(sortBy);
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 1;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const bootcamps = await query;

    const pagination = {};

    if(endIndex < total){
        pagination.next = {
            page : page+1,
            limit:limit
        }
    }
    if(startIndex > 0){
        pagination.prev = {
            page : page-1,
            limit:limit
        }
    }

    res.status(200).json({success:true,count:bootcamps.length,pagination : pagination,data:bootcamps});
    //next(err);

});

exports.getBootcamp = asyncHandler(async (req,res,next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,400));
        }
        res.status(200).json({success:true,data:bootcamp});

   
});

exports.createBootcamp = asyncHandler(async (req,res,next) => {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success:true,
            data:bootcamp
        });
});

exports.updateBootcamp = asyncHandler(async (req,res,next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,400));
        }
        res.status(200).json({sucess:true,data:bootcamp});
    
});

exports.deleteBootcamp = asyncHandler(async (req,res,next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,400));
        }
        res.status(200).json({sucess:true,data:{}});
    
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;
  
    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
  
    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
  
    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
  
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    });
  });