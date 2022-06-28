  import "./app.css";
  import ReactMapGL, { Marker, Popup } from "react-map-gl";
  import { useEffect, useState } from "react";
  import { Room, Star } from "@material-ui/icons";
  import axios from "axios";
  import { format } from "timeago.js";
  import Register from "./components/Register";
  import Login from "./components/Login";
  // import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
  import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


  function App() {
    const myStorage = window.localStorage;
    const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
    const [pins, setPins] = useState([]);
    // const [cards,setCard] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [star, setStar] = useState(0);
    const [type,setType] = useState("");
    const [typeinp, setTypeinp] = useState("");
    const [viewport, setViewport] = useState({
      latitude: 47.040182,
      longitude: 17.071727,
      zoom: 4,
    });
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    // const [confirm, setConfirm] = useState(false);


    const handleMarkerClick = (id, lat, long) => {
      setCurrentPlaceId(id);
      setViewport({ ...viewport, latitude: lat, longitude: long });
    };

    const handleAddClick = (e) => {
      const [longitude, latitude] = e.lngLat;
      setNewPlace({
        lat: latitude,
        long: longitude,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const newPin = {
        username: currentUsername,
        title,
        type: typeinp,
        desc,
        rating: star,
        lat: newPlace.lat,
        long: newPlace.long,
      };

      try {
        const res = await axios.post("/pins", newPin);
        setPins([...pins, res.data]);
        setNewPlace(null);
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(() => {
      const getPins = async () => {
        try {
          const allPins = await axios.get("/pins");
          setPins(allPins.data);
        } catch (err) {
          console.log(err);
        }
      };
      getPins();
    }, []);

    useEffect(() => {
      console.log(type)
      const getPins = async () => {
        try {
          const allPins = await axios.get("/pins/" + type);
          setPins(allPins.data)
        }catch (err) {
          console.log(err);
          }
        };
        getPins();
        },[type]);

    const handleLogout = () => {
      setCurrentUsername(null);
      myStorage.removeItem("user");
    };

    //   const handleDelete = async (id) => {
    //     try {
    //       const allPins = await axios.get("/pins" + id);
    //       setPins(allPins.data);
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   };
    //   getPins();
    // }
    async function handleDelete(id){
      console.log(id)
      try{
        const allPins = await axios.get("/pins/delete/" + id);
        setPins(allPins.data);
        }catch (err) {
          console.log(err);
      }
    }

    
    return (
      <div style={{ height: "100vh", width: "100%" }}>
        {/* {confirm}  */}
        {/* <div className="confirmDelete">Are you sure you want to delete
          <button onClick={handleDelete()}>Yes</button>
          <button onClick={setConfirm(false)}>No</button>
        </div>:<></> */}

        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken="pk.eyJ1IjoibG9sbG1hbyIsImEiOiJjbDRwcTZwYjYwMmcxM2l0M2JqYmt0bWRvIn0.LHTKFmQ6bpGHQTlRTGYeTQ"
          width="100%"
          height="100%"
          transitionDuration="200"
          // mapStyle="mapbox://styles/lollmao/cl4tu0nk5002116prpdq27uzd"
          // mapStyle="mapbox://styles/lollmao/cl4tta7p5003814lp7tpvdhkv"
          onViewportChange={(viewport) => setViewport(viewport)}
          onDblClick={currentUsername && handleAddClick}
        >

          {pins.map((p,index) => (
            <>
              <Marker
                latitude={p.lat}
                longitude={p.long}
                offsetLeft={-3.5 * viewport.zoom}
                offsetTop={-7 * viewport.zoom}
              >
                <Room
                  style={{
                    fontSize: 7 * viewport.zoom,
                    color:
                      currentUsername === p.username ? "purple" : "red",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                />
              </Marker>
              {p._id === currentPlaceId && (
                <Popup
                  key={p._id}
                  latitude={p.lat}
                  longitude={p.long}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setCurrentPlaceId(null)}
                  anchor="left"
                  className="zindexed"
                >
                  <button className="deletebutton" onClick={() => handleDelete(p._id) }><DeleteForeverIcon fontSize="small"/></button>
                  
                  {/* <>{p._id}</> */}
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{p.title}</h4>
                    <label>Type</label>
                    <p className="desc">{p.type}</p>
                    <label>Description</label>
                    <p className="desc">{p.desc}</p>
                    <label>Rating</label>
                    <p className="review">{p.rating}</p>
                    <div className="stars">
                      {Array(p.rating).fill(<Star className="star" />)}
                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created by <b>{p.username}</b>
                    </span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </>
          ))}
          {newPlace && (
            <>
              <Marker
                latitude={newPlace.lat}
                longitude={newPlace.long}
                offsetLeft={-3.5 * viewport.zoom}
                offsetTop={-7 * viewport.zoom}
              >
                <Room
                  style={{
                    fontSize: 7 * viewport.zoom,
                    color: "purple",
                    cursor: "pointer",
                  }}
                />
              </Marker>
              <Popup
                latitude={newPlace.lat}
                longitude={newPlace.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setNewPlace(null)}
                anchor="left"
              >
                <div>
                  <form onSubmit={handleSubmit}>
                    <label>Title</label>
                    <input
                      placeholder="Enter a title"
                      autoFocus
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <label>Type</label>
                    <input 
                      placeholder="Enter the type of place"
                      autoFocus
                      onChange={(e) => setTypeinp(e.target.value)}/>
                    <label>Description</label>
                    <textarea
                      placeholder="Say us something about this place."
                      onChange={(e) => setDesc(e.target.value)}
                    />
                    <label>Rating</label>
                    <select onChange={(e) => setStar(e.target.value)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <button type="submit" className="submitButton">
                      Add Pin
                    </button>
                  </form>
                </div>
              </Popup>
            </>
          )}
          <input type="text"  placeholder="Please enter the place" value= {type} onChange={(e) => {setType(e.target.value)}}/>
          {/* <list></> */}
          {currentUsername ? (
            <button className="button logout" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <div className="buttons">
              <button className="button login" onClick={() => setShowLogin(true)}>
                Log in
              </button>
              <button
                className="button register"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </div>
          )}
          {showRegister && <Register setShowRegister={setShowRegister} />}
          {showLogin && (
            <Login
              setShowLogin={setShowLogin}
              setCurrentUsername={setCurrentUsername}
              myStorage={myStorage}
            />
          )}
        </ReactMapGL>
      </div>
    );
  }

  export default App;
