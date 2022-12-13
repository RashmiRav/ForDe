// const router = require("express").Router();
// const Razorpay = require("razorpay")
// const crypto = require("crypto")

// router.post("/pay",async(req,res)=>{
//     try{

//         const instance = new Razorpay({
//             key_id:process.eventNames.KEY_ID,
//             key_secret:process.env.KEY_SECRET
//         })

//         const options ={
//             amount:req.body.amount * 100,
//             currency:"INR",
//             receipt:crypto.randomBytes(10).toString("hex")
//         }
//         instance.pays.create(options,(error,pay)=>{
//             if(error){
//                 console.log(error);
//                 return res.status(500).json({message:"Payment went wrong!"})
//             }
//         })
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({message:"Payment went wrong in err!"})
//     }
// })
// router.post("/verfy",async(req,res)=>{
//     try{
//         const {
//             razorpay_pay_id,
//             razorpay_payment_id,
//             razorpay_signature

//         } = req.body

//         const sign = razorpay_pay_id+"|" + razorpay_payment_id
//         const expectedSign = crypto
//         .createHmac("sha256",process.env.KEY_SECRET)
//         .update(sign.toString())
//         .digest("hex");

//         if(razorpay_signature===expectedSign){
//             return res.status(200).json({message:"Payment verified successfully"})
//         }
//         else{
//             return res.status(400).json({message:"Invalid signature sent"})
//         }
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({message:"Internal Srver Error...!!"})
//     }
// })
// module.exports = router