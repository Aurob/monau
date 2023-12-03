javascript:(function() {
    let videos = document.getElementsByTagName("video");
    let images = document.getElementsByTagName("img");

    let all = [];
    
    for(let v = 0; v < videos.length; v++) {
        all.push(videos[v].cloneNode(true));
    }

    for(let i = 0; i < images.length; i++) {
        all.push(images[i].cloneNode(true));
    }

    document.write("<html><body><div style='display: flex; flex-wrap: wrap;'>");
    for(let a = 0; a < all.length; a++) {
        let elem = all[a];
        elem.style.width = "50%";
        elem.style.height = "100%";
        document.write(elem.outerHTML);
    }
    document.write("</div></body></html>");

  })();
  