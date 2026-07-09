import Transpoter from "./email";

const sendOtp = async(otp,email)=>{
    try{
        await Transpoter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:"Your Otp Code",
            html = `
<div style="margin:0; padding:40px 20px; background:#f4f7fb; font-family:Arial, Helvetica, sans-serif;">
    <div style="max-width:500px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

        <div style="background:#2563eb; padding:20px; text-align:center;">
            <h1 style="margin:0; color:#ffffff;">OTP Verification</h1>
        </div>

        <div style="padding:30px; color:#333333;">

            <p style="font-size:16px; margin-bottom:20px;">
                Hello,
            </p>

            <p style="font-size:15px; line-height:1.6;">
                Use the following One-Time Password (OTP) to complete your verification.
            </p>

            <div style="margin:30px 0; text-align:center;">
                <span style="
                    display:inline-block;
                    background:#f3f4f6;
                    border:2px dashed #2563eb;
                    color:#2563eb;
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    padding:16px 32px;
                    border-radius:10px;
                ">
                    ${otp}
                </span>
            </div>

            <p style="font-size:15px; color:#555555;">
                ⏳ This OTP is valid for <strong>5 minutes</strong>.
            </p>

            <p style="font-size:15px; color:#555555;">
                If you didn't request this OTP, you can safely ignore this email.
            </p>

        </div>

        <div style="background:#f9fafb; padding:15px; text-align:center; border-top:1px solid #e5e7eb;">
            <p style="margin:0; font-size:13px; color:#888888;">
                This is an automated email. Please do not reply.
            </p>
        </div>

    </div>
</div>
`,
        });
    }catch(err){
        console.log("Send otp error: ",err);
        throw err;
    }
};

export default sendOtp;