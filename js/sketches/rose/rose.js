Pts.namespace( this );
let space = new SVGSpace( "#pt");
space.setup({ bgcolor: "#fff", retina: true, resize: true});

let pts, temp, radius;
let form = space.getForm();

function makeRose(){
    radius = space.size.minValue().value/3;

    let i = 0;

    for (let r = radius; r > 10; r -= 5 + 50*(r/radius)**2){
    pts = Create.radialPts( space.center, r, 10  );
    pts.map( p => p.add( (10+50*(r/radius)**2)*(Math.random() - Math.random()) ) )

    let temp = pts.clone();
    temp.push( temp.p1 );
    temp.push( temp.p2 );
    temp.push( temp.p3 );

    if (i % 2 == 0){
        form.fillOnly(`rgba(${170 + 85*r/radius}, 0, ${0 + 0* (1 - r/radius)}, 1)`).line( Curve.bspline( temp, 10 ) );
    } else{
        form.fillOnly("rgba(0, 0, 0, 1)").line( Curve.bspline( temp, 10 ) );
    }
    i++;
    }
}

space.add({ 
start: function (bound) {
    makeRose();
},
resize: function (bound) {
    if (form._ready){
        space.clear();
        makeRose();
    }
}
});