AFRAME.registerComponent("markerhandler", {
    init: async function () {
      var toys = await this.getToys();
  
      //markerFound event
      this.el.addEventListener("markerFound", () => {
        var markerId = this.el.id;      
        this.handleMarkerFound(toys, markerId);
      });
  
      //markerLost event
      this.el.addEventListener("markerLost", () => {
        this.handleMarkerLost();
      });
  
    },
    handleMarkerFound: function (toys, markerId) {
      var todaysDate = new Date();
      var todaysDay = todaysDate.getDay();

      let days = [
        "sunday",
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday'
      ];

      var toy = toys.filter(toy => toy.id === markerId)[0];

      if(toy.unavailable_days.includes(days[todaysDay])){
        swal({
          icon: "warning",
          title: toy.toy_name.toUpperCase(),
          text: "This toy is not available today!!!",
          timer: 2500,
          buttons: false
        });
      }else {
          // Changing Model scale to initial scale
         var model = document.querySelector(`#model-${toys.id}`);
         model.setAttribute("position", toys.model_geometry.position);
         model.setAttribute("rotation", toys.model_geometry.rotation);
         model.setAttribute("scale", toys.model_geometry.scale);
   
         //Update UI conent VISIBILITY of AR scene(MODEL , INGREDIENTS & PRICE)
         model.setAttribute("visible",true);
   
         var ingredientsContainer = document.querySelector(`#main-plane-${toys.id}`);
         ingredientsContainer.setAttribute("visible", true);
   
         var priceplane = document.querySelector(`#price-plane-${toys.id}`);
         priceplane.setAttribute("visible", true)
   
         // Changing button div visibility
         var buttonDiv = document.getElementById("button-div");
         buttonDiv.style.display = "flex";
   
         var ratingButton = document.getElementById("rating-button");
         var orderButtton = document.getElementById("order-button");
   
         // Handling Click Events
         ratingButton.addEventListener("click", function() {
           swal({
             icon: "warning",
             title: "Rate Toy",
             text: "Work In Progress"
           });
         });
   
         orderButtton.addEventListener("click", () => {
           var tNumber;
           tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`;
           this.handleOrder(uid, toy);
   
           swal({
             icon: "https://i.imgur.com/4NZ6uLY.jpg",
             title: "Thanks For Order !",
             text: "Your order will arrive soon !",
             timer: 2000,
             buttons: false
           });
         });
       }
      },

      handleOrder(uid,toy){
        firebase
        .firestore()
        .collection()
        .doc(uid)
        .get()
        .then(doc =>{
          var details = doc.data();

          if(details['current_orders'][toy.id]){
            details['current_orders'][toy.id]['quantity'] += 1

            var currentQuantity = details['current_orders'][toy.id]["quantity"];

            details["current_orders"]['toy.id']['subtotal'] = currentQuantity * toy.price;
          }else{
            details["current_orders"]['toy.id'] = {
              item : toy.toy_name,
              price : toy.price,
              quantity : 1,
              subtotal : toy.price * 1
            };
          }

          details.total_bill += toy.price;

          firebase
          .firestore()
          .collection("users")
          .doc(doc.id)
          .update(details);
        })
      },
});