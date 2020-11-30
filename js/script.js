if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js ')
    .then( (reg) => console.log('service worker registered', reg))
    .catch( (err) => console.log('service worker not registered', err))
}

const galleryBtn = document.getElementById('btn-s');
let gallerySection = document.querySelector('.gallery');
const mainPage = document.getElementById('first-page');
const cameraBtn = document.querySelector('.btn-floating');
const cameraPage = document.querySelector('.camera');
const newPicSection = document.querySelector('.new-pic');



window.addEventListener('load', () => {
    galleryBtn.addEventListener('click', () => {
        console.log('hey')
        gallerySection.classList.remove('hidden');
        mainPage.classList.add('hidden');
    })

    cameraBtn.addEventListener('click', () => {
        gallerySection.classList.add('hidden');
        mainPage.classList.add('hidden');
        cameraPage.classList.remove('hidden');
    })

    if('mediaDevices' in navigator) {
        cameraSetting();
    }

})

function cameraSetting() {
    const cameraOnBtn = document.getElementById('cameraOn');
    const cameraOffBtn = document.getElementById('cameraOff');
    const photoBtn = document.getElementById('takePic');
    const newPic = document.querySelector('.pic');
    const backBtn = document.getElementById('backToGallery');

    const errorMsg = document.querySelector('.error-message');

    const video = document.querySelector('video');

    let stream;

    //camera button ON
    cameraOnBtn.addEventListener('click', async () => {
        errorMsg.innerHTML = '';
        
        try {
            const md = navigator.mediaDevices;
            stream = await md.getUserMedia({
                video: { width: 320, height:320 }
            })

            video.srcObject = stream;

            photoBtn.classList.remove('hidden');
            cameraOffBtn.classList.remove('hidden');
            cameraOnBtn.classList.add('hidden');
        }
        catch(e) {
            errorMsg.innerHTML = 'Please allow the app to access to camera'
        }
    })

    //camera button Off
    cameraOffBtn.addEventListener('click', async () => {
        errorMsg.innerHTML = '';
        if( !stream ) {
            errorMsg.innerHTML = 'No video to stop!'
            return;
        }

        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        photoBtn.classList.add('hidden');
        cameraOnBtn.classList.remove('hidden');
        cameraOffBtn.classList.add('hidden');
    })

    //take a PICTURE
    photoBtn.addEventListener('click', async () => {
        errorMsg.innerHTML = '';

        if( !stream ) {
            errorMsg.innerHTML = 'No video to take a photo!'
            return;
        }

        let tracks = await stream.getTracks();
        let videoTrack = tracks[0];

        let capture = new ImageCapture(videoTrack);
        let blob = await capture.takePhoto();

        let imgUrl = URL.createObjectURL(blob);
        newPic.src = imgUrl;
        newPicSection.classList.remove('hidden');

        const yesBtn = document.getElementById('yes');
        const noBtn = document.getElementById('no');
        const questionSection = document.getElementById('question');
        const images = document.querySelector('.row');

        //save Image in Gallery
        yesBtn.addEventListener('click', () => {
            images.innerHTML += `
                <div class="col s12 l4">
                    <div class="card">
                        <div class="card-image">
                            <img src="${imgUrl}" alt="" />
                        </div>
                        <div class="card-content">
                            <p class="city">City: </p>
                            <p class="country">Country: </p>
                            <div class="deletePic">
                            <i class="material-icons green-text text-lighten-1">delete_outline</i>
                            </div>
                            <div class="downloadPic">
                                <i class="material-icons blue-text">arrow_download</i>
                            </div>
                        </div>
                    </div>
                </div>
            `
            newPic.src = '';
            newPicSection.classList.add('hidden');

            //for Deleting Pictures
            const deleteBtns = document.querySelectorAll('.deletePic');
            deleteBtns.forEach( deleteBtn => {
                deleteBtn.addEventListener('click', () => {
                    deleteBtn.parentElement.parentElement.remove();
                })
            })


            //for downloading Pictures
            const downloadBtns = document.querySelectorAll('.downloadPic');
            downloadBtns.forEach( downloadBtn => {
                downloadBtn.addEventListener('click', () => {
                    console.log('hej');
                    let pictures = document.querySelectorAll('.col > .card > .card-image > img');
                
                    pictures.forEach( picture => {
                        console.log(picture);
                        let imgPath = picture.getAttribute('src');
                        console.log(imgPath);
                        let fileName = getFileName(imgPath);
                        console.log(fileName)


                        saveAs(imgPath, fileName);
                    })

                    function getFileName(str) {
                        return str.substring(str.lastIndexOf('/') + 1)
                    }
                })
            })
        })

        questionSection.classList.remove('hidden');

        //Don´t want save Image in GALLERY
        noBtn.addEventListener('click', () => {
            newPic.src = '';
            questionSection.classList.add('hidden');
            newPicSection.classList.add('hidden');
        })

        questionSection.classList.remove('hidden');
    })


    backBtn.addEventListener('click', () => {
        gallerySection.classList.remove('hidden');
        cameraPage.classList.add('hidden');

        if ('geolocation' in navigator) {
            findLocation();
        }

    })
}

function findLocation() {

    if('geolocation' in navigator) {
        const geo = navigator.geolocation;
        geo.getCurrentPosition( pos => {
            console.log(pos);
            let lat = pos.coords.latitude;
            let lng = pos.coords.longitude;

            getAddressFromPosition(lat,lng);    
        },
        error => {
            console.log('could not get position', error);
            alert('Please allow position first!');
        })
    } else {
        alert( ' This device couldn´t access to Geolocation API!');
        }
}


//Reverse Geocoding
async function getAddressFromPosition(lat,lng) {
    // curl 'https://geocode.xyz/51.50354,-0.12768?geoit=xml'
    const city = document.querySelector('.city');
    const country = document.querySelector('.country');
    
    try {       
        const response = await fetch(` https://geocode.xyz/${lat},${lng}?json=1`);
        const data = await response.json();
        console.log(data);
        if(data.error) {
            alert('Could not get location information at this time. Please try again!');
        }
        else{    
            console.log('Address Position: data=', data)
            const userCity = data.city;
            const userCountry = data.country;
            city.innerHTML += `${userCity}`;
            country.innerHTML += `${userCountry}`;
        }
    } 
    catch(error) {
        alert('Could not find your location');
    }

}    

//for Deleting Pictures
const deleteBtns = document.querySelectorAll('.deletePic');
deleteBtns.forEach( deleteBtn => {
    deleteBtn.addEventListener('click', () => {
        deleteBtn.parentElement.parentElement.remove();
    })
})




