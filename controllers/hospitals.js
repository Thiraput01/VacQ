const Hospital = require('../models/Hospital');
const VacCenter = require('../models/VacCenter');
//@desc    Get all hospitals
//@route   Get /api/v1/hospitals
//@access  Public
exports.getHospitals = async (req, res, next)=>{
    let query;

    //copy req.query
    const reqQuery = {...req.query};

    //fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over remove fields and remove it from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    //create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`);

    query = Hospital.find(JSON.parse(queryStr)).populate('appointments');
    
    //select fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIdx = (page - 1) * limit;
    const endIdx = page * limit;
    try{
        const total = await Hospital.countDocuments();
        query = query.skip(startIdx).limit(limit);
        
        //execute query
        const hospitals = await query;

        //pagination result
        const pagination = {}
        
        if(endIdx < total){
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if(startIdx > 0){
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        res.status(200).json({success:true, count:hospitals.length, data:hospitals});
    } catch(err){
        res.status(400).json({success:false});
    }
  
};

//@desc    Get single hospital
//@route   GET /api/v1/hospitals/:id
//@access  Public
exports.getHospital = async (req, res, next)=>{

    try{
        const hospital = await Hospital.findById(req.params.id);

        if(!hospital){
            return res.status(400).json({success:false});
        }
        return res.status(200).json({success:true, data:hospital});

    }catch(err){
        res.status(400).json({success:false});
    }
};

//@desc    Create a hopitsal
//@route   POST /api/v1/hospitals
//@access  Private
exports.createHospital = async (req, res, next)=>{
    const hospital = await Hospital.create(req.body);
    res.status(201).json({success: true,  data: hospital});
};

//@desc    Update single hospital
//@route   PUT /api/v1/hospitals/:id
//@access  Private
exports.updateHospital = async (req, res, next)=>{
    try{
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if(!hospital){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data: hospital});

    }catch (err){
        res.status(400).json({success:false});
    }
};

//@desc    Delete single hospital
//@route   DELETE /api/v1/hospitals/:id
//@access  Private
exports.deleteHospital = async (req, res, next)=>{
    console.log("try to delete");
    try{
        const hospital = await Hospital.findById(req.params.id);

        if(!hospital){
            return res.status(404).json({success:false, message:`Hospital with ${req.params.id} not found`});
        }
        await hospital.deleteOne();
        res.status(200).json({success:true, data: {}});
        return 
    }catch (err){
        console.log(err);
        res.status(400).json({success:false});
    }
    
};

//@desc    Get vaccine centers
//@route   GET /api/v1/hospitals/vacCenters/
//@access  Public
exports.getVacCenters = (req, res, next)=>{
    VacCenter.getAll((err, data) => {
        if(err){
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Vaccine Centers."
            });
        }else{
            console.log("sending data.....\n");
            res.send(data);
        }
    });
};