import React,{useState,useEffect} from "react"
import Pharmacist_Navbar from "./Pharmacist_header";
import {Link} from 'react-router-dom';

import axios from "axios";
import { Image } from "cloudinary-react";
import Razorpay from "razorpay"
import "./PFoarm.css"

function AllOrders(){
    
    const[Orders,setOrders] = useState([]);
    const[searchTerm,setSearchTerm]=useState("");
  
    useEffect(()=>{

      // const script = document.createElement("script");
      // script.src = "https://checkout.razorpay.com/v1/checkout.js";
      //     script.async = true;
      // document.body.appendChild(script);

        function getOrders(){
            axios.get(`/order/`).then((res)=>{
               // console.log(res.data)
                setOrders(res.data)
                 
            }).catch((err)=>{
                alert(err.message)
            })
        }
        getOrders();
    } , [])
    
    const initPayment =(data)=>{
      console.log("------------- test4")
      const options ={
        key:"rzp_test_DFMZJKKQrJn2i9",
        amount:data.amount,
        currency:data.currency,
        name:"Doctor Appointment",
        description:"Test Transaction",
        // image:"123qwe",
        order_id:data.id,
        handler:async(response)=>{
          try{
            console.log("------------- test5")
            const verfyUrl = `/item/verfy`
            console.log("------------- test6")
            const {data} = await axios.post(verfyUrl,response);
            console.log(data)
          }
          catch(error){
            console.log(error)
          }
        },
        theme:{
          color:"#3399cc"
        },
      }
      console.log("------------- test7")
      
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      console.log("------------- test8")
    }
        const handlePayment=async()=>{
          try{
            const payurl = `/item/pays`
            console.log("------------- test1")
            const {data} = await axios.post(payurl,{amount:"1500"});
            console.log("------------- test2")
            console.log("------------- test3",data)

            initPayment(data.data)

          }
          catch(error){

          }
        }

    return(
        <div className="AllOrdercontainer">
             <Pharmacist_Navbar/>
             <div className="OrderTable">
             <h4 align="middle">All Orders</h4><br/>
        
             <input type="text" className="searchbx" placeholder="Search..." onChange={event=>{setSearchTerm(event.target.value)}}/>
             <div className="tableOrder">
            <table className="table"> 
        <thead className="thead-dark">
          <tr>
            <th>Patient Name</th>
            <th>Address</th>
            <th>Telephone No.</th>
            <th>Drug List</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="data">
          { Orders.filter((Order)=>{
        if(searchTerm==""){
          return Order
        }
        else if(Order.name.toLowerCase().includes(searchTerm.toLowerCase())){
          return Order
        }
        else if(Order.address.toLowerCase().includes(searchTerm.toLowerCase())){
          return Order
        }
        else if(Order.status.toLowerCase().includes(searchTerm.toLowerCase())){
          return Order
        }
        
        
      }).map(Order => {
          return (
            <tr>
              
              <td style={{paddingTop:"12vh"}}>{Order.name}</td>
              {/* <td>{Order.MediList}</td> */}
              <td style={{paddingTop:"12vh"}}>{Order.address}</td> 
              <td style={{paddingTop:"12vh"}}>{Order.telNo}</td>
              <td ><Image className="img" 
                  cloudName="/iplus/image/upload/" publicId={Order.photo}/>
              </td> 
              <td style={{paddingTop:"12vh"}}>{Order.status}</td> 
              <div className="btn-tb"><td> <Link to={"/pharmacist/orders/delivery/"+Order._id}> <button type="button" className="btn btn-primary">Deliver</button></Link>
              {/* <div className="btn-tb"><td>  <button onClick={handlePayment} type="button" className="btn btn-primary">Deliver</button> */}
              </td></div>
              
            </tr>
            
          )
        })}
          </tbody>
      </table>
     
        </div>
        </div> </div>
        
    )
}

export default AllOrders;

