const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/paymentController");

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;



// import React from "react";
// import { View, Button, Alert } from "react-native";
// import RazorpayCheckout from "react-native-razorpay";

// const PaymentScreen = ({ userId, token }) => {

//   const planAmount = {
//     silver: 299,
//     gold: 499,
//     fullAccess: 999,
//   };

//   const handlePayment = async (plan) => {
//     try {
//       // 1️⃣ Create order from backend
//       const res = await fetch("http://your-server.com/api/payment/create-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           amount: planAmount[plan],
//           userId,
//           plan,
//         }),
//       });
//       const data = await res.json();
//       const { order } = data;

//       // 2️⃣ Open Razorpay modal
//       const options = {
//         description: `Subscription ${plan}`,
//         image: "https://your-logo.png",
//         currency: order.currency,
//         key: "YOUR_RAZORPAY_KEY_ID", // frontend key
//         amount: order.amount,
//         order_id: order.id,
//         name: "Digital Photo Frame",
//         prefill: {
//           email: "user@example.com",
//           contact: "9999999999",
//         },
//         theme: { color: "#F37254" },
//       };

//       RazorpayCheckout.open(options)
//         .then(async (payment) => {
//           // 3️⃣ Payment success → verify on backend
//           const verifyRes = await fetch(
//             "http://your-server.com/api/payment/verify-payment",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify({
//                 razorpay_order_id: payment.razorpay_order_id,
//                 razorpay_payment_id: payment.razorpay_payment_id,
//                 razorpay_signature: payment.razorpay_signature,
//                 userId,
//                 plan,
//               }),
//             }
//           );
//           const verifyData = await verifyRes.json();
//           Alert.alert("Success", verifyData.message);
//         })
//         .catch((err) => {
//           Alert.alert("Payment Failed", err.description || "Try again!");
//         });
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Something went wrong");
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Button title="Pay Silver ₹299" onPress={() => handlePayment("silver")} />
//       <Button title="Pay Gold ₹499" onPress={() => handlePayment("gold")} />
//       <Button title="Pay Full Access ₹999" onPress={() => handlePayment("fullAccess")} />
//     </View>
//   );
// };

// export default PaymentScreen;
