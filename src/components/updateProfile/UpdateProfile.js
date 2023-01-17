import React, { useEffect, useState } from "react";
import "./UpdateProfile.scss";
import userImg from "../../assets/user.png";
import dummyUserImg from '../../assets/user.png'
import { useSelector ,useDispatch} from "react-redux";
import { updateMyProfile } from "../../redux/slices/appConfigSlice";


function UpdateProfile() {
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [userImg, setUserImg] = useState("");
const dispatch = useDispatch();


  useEffect(() => {
    setName(myProfile?.name || '');
    setBio(myProfile?.bio || '');
    //  setUserImg(myProfile?.avatar.url  || '');   // --> error when i uncomment this line
    setUserImg(myProfile?.avatar?.url);
  }, [myProfile]);


  //using fileReader to input files as base64(change profile image)
function handleImageChange(e){
const file = e.target.files[0]; //you can also add multiple files
const fileReader = new FileReader(); // you get fileReader within the DOM itself,this fileReader will encode image to base64
fileReader.readAsDataURL(file); //it is async operation..add the image to fileReader to convert to base64..
fileReader.onload = ()=>{  //once image is loaded into fileReader
  if(fileReader.readyState === fileReader.DONE){ //check if its successful to read or ready to read
    setUserImg(fileReader.result)  //set the user Imae to new image
    // console.log('image data after encoding to base64',fileReader.result)
  }
}
}


function handleSubmit(e){
  e.preventDefault();
  dispatch(updateMyProfile({
    name,
    bio,
    userImg
  }));
}

  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
          {/* code to add image from desktop */}
            <label htmlFor="inputImg" className="labelImg"> 
            <img src={userImg ? userImg : dummyUserImg} alt="display picture" />
            </label> 
            <input className="inputImg" id='inputImg' type="file" accept="image/*" onChange={handleImageChange}/>
          </div>
        </div>

        <div className="right-part">
          <form onSubmit={handleSubmit}>
            <input
              value={name} 
              type="text"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              value={bio} 
              type="text"
              placeholder="Your Bio"
              onChange={(e) => setBio(e.target.value)}
            />
            <input type="submit" className="btn-primary" onClick={handleSubmit}/>
          </form>
          <button className="deletAccount btn-primary">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
