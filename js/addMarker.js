AFRAME.registerComponent("create-markers", {
    init: async function(){
      var main_scene = document.querySelector('#main-scene');
      var toys = await this.getToys();
      toys.map(toy=>{
        let marker = document.createElement("a-marker");
        marker.setAttribute('id',toy.id);
        marker.setAttribute('type','pattern');
        marker.setAttribute("url",toy.marker_pattern_url);
        marker.setAttribute('cursor',{rayOrigin : "mouse"});
        marker.setAttribute('markerhandler',{});
        main_scene.appendChild(marker);
  
        let model = document.createElement('a-entity');
        model.setAttribute('id',`model-${toy.id}`);
        model.setAttribute('position',toy.model_geometry.position);
        model.setAttribute('rotation',toy.model_geometry.rotation);
        model.setAttribute('scale',toy.model_geometry.scale);
        model.setAttribute('gltf-model',`url(${toy.model_url})`);
        model.setAttribute('gesture-handler',{});
        marker.appendChild(model);
  
        var main_plane = document.createElement('a-plane');
        main_plane.setAttribute('id',`main-plane-${toy.id}`);
        main_plane.setAttribute('position',{x:0, y:0, z:0});
        main_plane.setAttribute('rotation',{x:-90, y:0, z:0});
        main_plane.setAttribute('width',1.7);
        main_plane.setAttribute('height',0.5);
        marker.appendChild(main_plane);
  
        let title_plane = document.createElement('a-plane');
        title_plane.setAttribute('id',`title-plane-${toy.id}`);
        title_plane.setAttribute('position',{x:0, y:0.89, z:0.02});
        title_plane.setAttribute('rotation',{x:0, y:0, z:0});
        title_plane.setAttribute('width',1.69);
        title_plane.setAttribute('height',0.3);
        title_plane.setAttribute('material',{color:'#F0C30F'});
        main_plane.appendChild(title_plane);
  
        let toy_title = document.createElement('a-entity');
        toy_title.setAttribute('id',`toy-title-${toy.id}`);
        toy_title.setAttribute('position',{x:0, y:0, z:0.1});
        toy_title.setAttribute('rotation',{x:0, y:0, z:0});
        toy_title.setAttribute('text',{
          font : "monoid",
          color : 'black',
          width : 1.8,
          height : 1,
          align : 'center',
          value : toy.toy_name.toUpperCase()
        });
        title_plane.appendChild(toy_title);
  
        let ingredients = document.createElement('a-entity');
        ingredients.setAttribute('id',`ingredients-${toy.id}`);
        ingredients.setAttribute('position',{x:0.3, y:0, z:0.1});
        ingredients.setAttribute('rotation',{x:0, y:0, z:0});
        ingredients.setAttribute('text',{
          font : "monoid",
          color : 'black',
          width : 2,
          height : 1,
          align : 'left',
          value : `${toy.ingredients.join("\n\n")}`
        });
        main_plane.appendChild(ingredients);
      })
    },
  
    getToys: async function(){
      return await firebase.firestore().collection('toys').get().then(snap=>{
        return snap.docs.map(doc=>doc.data());
      })
    },
});