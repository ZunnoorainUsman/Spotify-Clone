console.log("lets write js");


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let responce = await a.text();
    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3.mpeg")){
            songs.push(element.href)
        }
    }
   return songs;

}
async function main() {
    let songs = await getSongs();
    console.log(songs)
    //play 1st song
    var audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener("loadeddata",()=>{
        console.log(audio.duration,audio.currentSrc,audio.currentTime);
    })
}
main()