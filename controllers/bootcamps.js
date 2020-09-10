const Bootcamp = require('../models/Bootcamp');


exports.getBootcamps = async (req,res,next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success:true,count:bootcamps.length,data:bootcamps});

    } catch (err) {
        res.status(400).json({sucess:false});
    }
};

exports.getBootcamp = async (req,res,next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            return res.status(400).json({sucess:false});
        }
        res.status(200).json({success:true,data:bootcamp});

    } catch (err) {
        //res.status(400).json({sucess:false});
        next(err);
    }
};

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
};

exports.updateBootcamp = async (req,res,next) => {
    try{
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!bootcamp){
            return res.status(400).json({sucess:false});
        }
        res.status(200).json({sucess:true,data:bootcamp});
    } catch(err){
        res.status(400).json({sucess:false});
    }
};

exports.deleteBootcamp = async (req,res,next) => {
    try{
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp){
            return res.status(400).json({sucess:false});
        }
        res.status(200).json({sucess:true,data:{}});
    } catch(err){
        res.status(400).json({sucess:false});
    }
};