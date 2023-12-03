javascript:(function() {
    let videos = document.getElementsByTagName("video");
    console.log(videos[0], videos.length);
    for(let v = 0; v < videos.length; v++) {
        let video = videos[v];
        let attrs = [];
        for(let a = 0; a < video.attributes.length; a++) {
            let attr = video.attributes[a];
            attrs.push(`${attr.name}="${attr.value}"`);
        }

        let p = `
            Select this <video> ?
            ${attrs.join("\n")}
        `;

        if(confirm(p)) {
            let speed = prompt("Enter speed");
            video.playbackRate = speed;
        }


        
    }
  })();
  