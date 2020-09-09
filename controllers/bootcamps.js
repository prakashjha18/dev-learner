const Bootcamp = require('../models/Bootcamp');


exports.getBootcamps = async (req,res,next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success:true,data:bootcamps});

    } catch (err) {
        res.status(400).json({sucess:false});
    }
}

exports.getBootcamp = async (req,res,next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return res.status(400).json({sucess:false});
        }
        res.status(200).json({success:true,data:bootcamp});

    } catch (err) {
        res.status(400).json({sucess:false});
    }
}

exports.createBootcamp = async (req,res,next) => {
    try{
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success:true,
            data:bootcamp
        });
    } catch (err){
        res.status(400).json({sucess:false});
    }
}

exports.updateBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg:`update bootcamp ${req.params.id}`});
}

exports.deleteBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg:`delete bootcamp ${req.params.id}`});
}