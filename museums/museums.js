
function create_collapse_button(id, text) {
    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-default btn-xs");
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", "#" + id);
    button.innerHTML = text;
    return button;
}

let Museums;

fetch('us-museum-stores-links.json')
    .then(res => res.json())
    .then(data => {
        for(let s = 0; s < Object.keys(data).length; s++) {
            let state = Object.keys(data)[s];
            $('#museum-list').append(`
                <h3 class="state">${state.replaceAll('-', ' ')}</h3>
                <div id="${state}-list" class="state-list"></div>
            `);

            for(let m = 0; m < data[state].museums.length; m++) {
                let museum = data[state].museums[m];
            
                $(`#${state}-list`).append(`
                <div id="museum${s}-${m}">
                    <a href="${museum.link}">${museum.name}</a>
                </div>
                `);
                if (museum.store_links.length > 0) {
                    let store_list = "<ul>";
                    museum.store_links.forEach(link => {
                        store_list += `<li><a href="${link}">${link}</a></li>`;
                    });
                    store_list += "</ul>";
                    $(`#museum${s}-${m}`).append(store_list);
                }
            }
        }
        Museums = data;
});


//Data formatting refactor

// fetch('us-museum-stores-links.json')
// .then(res => res.json())
// .then(data => {
//     console.log(data);

//     Object.keys(data).forEach((state, s) => {
//         $('#museum-list').append(`
//         <h3 class="state">${state.replaceAll('-', ' ')}</h3>
//         <div id="${state}-list" class="state-list"></div>
//         `);
        
//         for(let m = 0; m < data[state].museums.length; m++) {
//             let museum = data[state].museums[m];
//             if(museum) {
//                 if (museum.store_links.length > 0) {
                    
//                     let links = [];
//                     let minlinks = [];
//                     for(let l = 0; l < museum.store_links.length; l++) {
//                         let link = museum.store_links[l];
//                         let current_link = link.match(/\/\/(www)?(.*?)\.(.*?)(\.|\/)/g);
                        
//                         if(current_link) {
//                             if(!minlinks.includes(current_link[0])) {
//                                 links.push(link);
//                                 minlinks.push(current_link[0]);
//                             }
//                         }
//                     }

//                     museum.store_links = links;
//                     $(`#${state}-list`).append(`
//                         <div id="museum${s}-${m}">
//                             <a href="${museum.link}">${museum.name}</a>
//                         </div>
//                     `);
//                     let store_list = "<ul>";
//                     for(let l = 0; l < links.length; l++) {
//                         let link = links[l];
//                         store_list += `<li><a href="${link}">${link}</a></li>`;
//                     }
//                     store_list += "</ul>";
//                     $(`#museum${s}-${m}`).append(store_list);
//                 }

                
//             }
//         }

//         console.log(data)
        
//     });
// });
