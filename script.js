console.log("lets write js");

let currenSong = new Audio();
let songs;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs");
    let responce = await a.text();
    console.log(responce)

    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mpeg") || element.href.endsWith(".mp3")) {
            songs.push(element.href.split("songs%")[1])
        }
    }
    return songs;
}

function playMusic(track, pause = false) {
    currenSong.src = "songs%" + track;
    // let audio = new Audio("songs%" + track);
    if (!pause) {
        currenSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
async function main() {

    let songs = await getSongs();
    playMusic(songs[0], true);
    console.log(songs)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Zunnoorain</div>
                            </div>
                            <div class="playnow">
                                <span>PLay now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div></li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (element) => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    });

    //to play next and previos
    play.addEventListener("click", () => {
        if (currenSong.paused) {
            currenSong.play()
            play.src = "pause.svg"
        } else {
            currenSong.pause()
            play.src = "play.svg"
        }
    })

    //listen for timeupadtae event
    currenSong.addEventListener("timeupdate", () => {
        // console.log(currenSong.currentTime,currenSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currenSong.currentTime)}/${secondsToMinutesSeconds(currenSong.duration)}`
        document.querySelector(".circle").style.left = (currenSong.currentTime / currenSong.duration) * 100 + "%";
    })

    //add evenbt to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currenSong.currentTime = ((currenSong.duration) * percent) / 100
    })


    //event for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })
    //event for closer
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //event 4 previous and next
    previous.addEventListener("click", () => {
        console.log(currenSong.src)
        let index = songs.indexOf(currenSong.src.split("/songs%").slice(-1)[0])
        console.log(index)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })
    next.addEventListener("click", () => {
        currenSong.pause()
        console.log(currenSong.src)
        
        let index = songs.indexOf(currenSong.src.split("/songs%").slice(-1)[0])
        console.log(index)
        
        if ((index + 1) < songs.length-1) {
            playMusic(songs[index + 1])
        }
    })
}
main()