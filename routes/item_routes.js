const router = require("express").Router();
let Item = require("../models/item_model");
//------
const Razorpay = require("razorpay")
const crypto = require("crypto")


   //Add item
router.route("/add").post((req,res)=>{
    console.log(req)
   const MediName = req.body.Medi_Name;
   const Amount = Number(req.body.Amount);
   const Cost = Number(req.body.Cost);
   const CompanyName = req.body.Company_Name;
   const ManuDate = req.body.ManuDate;
   const ExpireDate = req.body.ExpireDate;
   
   //console.log(ManuDate);
   //console.log(ExpireDate);
   
   console.log("Medicine name is:"+MediName)

   const newItem = new Item({MediName,Amount,Cost,CompanyName,ManuDate,ExpireDate});
                  
                  //If successfully added
   newItem.save().then(()=>{

       res.json(" Item Added")
       
        //If error occure 
   }).catch((err)=>{
       console.log(err);
   })

})

//View items 
router.route("/").get((req,res)=>{
    Item.find().then((items)=>{
        res.json(items)
    }).catch((err)=>{
        console.log(err);
    })
}) 

//update items
router.route("/update/:id").put(async(req,res) => {
    let userId=req.params.id;
    const {MediName,Amount,Cost,CompanyName,ManuDate,ExpireDate}=req.body;

    const updateItem = {
        MediName,
        Amount,
        Cost,
        CompanyName,
        ManuDate,
        ExpireDate
    }
    const update = await Item.findByIdAndUpdate(userId, updateItem).then(()=>{
        res.status(200).send({status:"Item updated"})
   }).catch((err)=>{
       res.status(500).send({status:"Error in updating Item", error: err.message})
       console.log(err.message);
   })
})

//delete item

router.route("/delete/:id").delete(async(req,res)=>{
    let userId = req.params.id;
    console.log(userId)
    await Item.findByIdAndDelete(userId).then(()=>{
        res.status(200).send({status: "Item deleted"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status:"Error in delte item",error:err.message});
    })
})

//Fetch an item using id
router.route("/get/:id").get(async(req,res)=>{
    let userId = req.params.id;
    //console.log(userId)
    const item = await Item.findById(userId).then((fitem)=>{
        res.status(200).send({status:"Item fetched",fitem})
        //console.log("success")
    }).catch((err)=>{
        res.status(500).send({status:"Item fetching failed", error: err.message})
        console.log(err.message)
    })
})


//payment route


router.post("/pays",async(req,res)=>{
    try{

        const instance = new Razorpay({
            key_id:process.env.KEY_ID,
            key_secret:process.env.KEY_SECRET
        })

        const options ={
            amount:req.body.amount * 100,
            currency:"LKR",
            receipt:crypto.randomBytes(10).toString("hex")
        }
        instance.orders.create(options, (err, order) =>{
                 if(err){
                console.log("error--->",err.message);
                return res.status(500).json({data:err})
            }else{
                console.log("response---->",order);
             return res.status(200).json({data:order})
            }
            
       
           
          });
        // instance.pays.create(options,(error,pay)=>{
        //     if(error){
        //         console.log(error);
        //         return res.status(500).json({message:"Payment went wrong!"})
        //     }
        //     return res.status(500).json({data:pay})
        // })
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Payment went wrong in err!"})
    }
})
router.post("/verfy",async(req,res)=>{
    console.log("backend verfy......",req.body)
    try{
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature

        } = req.body

        const sign = razorpay_order_id+"|" + razorpay_payment_id
        const expectedSign = crypto
        .createHmac("sha256",process.env.KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

        if(razorpay_signature===expectedSign){
            return res.status(200).json("Payment verified successfully")
        }
        else{
            return res.status(400).json({message:"Invalid signature sent"})
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Srver Error...!!"})
    }
})
module.exports = router

module.exports = router;