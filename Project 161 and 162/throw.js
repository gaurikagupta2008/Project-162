AFRAME.registerComponent("bowling-ball", {
  init: function () {
    this.throw();
  },
  throw: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        var  ball = document.createElement("a-entity");

        ball.setAttribute("gltf-model", "./models/bowling_ball/scene.gltf");

        ball.setAttribute("scale", { x: 3, y: 3,  z: 3});

        var cam = document.querySelector("#camera");

        pos = cam.getAttribute("position");

        ball.setAttribute("position", {
          x: pos.x,
          y: pos.y-1.2,
          z: pos.z,
        });

        var camera = document.querySelector("#camera").object3D;

        //get the camera direction as Three.js Vector
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        //set the velocity and it's direction
        ball.setAttribute("velocity", direction.multiplyScalar(-10));

        var scene = document.querySelector("#scene");
        ball.setAttribute("dynamic-body",{
          shape:"sphere",
          mass:"0"
          });
        ball.addEventListener("collide",this.removeBall)
        scene.appendChild(ball);
      }
    });
  },
  removeBall: function (e) {
    //Original entity (bullet)
    console.log(e.detail.target.el);

    //Other entity, which bullet touched.
    console.log(e.detail.body.el);

    //bullet element
    var el=e.detail.target.el

    //element which is hit
    var elHit=e.detail.body.el

    if (elHit.id.includes("pin")) 
      {
        //set material attribute
        elHit.setAttribute("material",{
          opacity:1,
          transparent:true
        });

        //impulse and point vector
        var impulse=new CANNON.Vec3(-2,2,1)
        var worldPoint=new CANNON.Vec3().copy(
          elHit.getAttribute("position")
        );
        elHit.body.applyImpulse(impulse,worldPoint)

        //remove event listener
        el.removeEventListener("collide",this.shoot)
        
        //remove the bullets from the scene
        var scene=document.querySelector("#scene")
        scene.removeChild(el)
    }
  },
});