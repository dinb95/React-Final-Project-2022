class Location{
    constructor(location){
        this.location = location
    }
     async get_location(){
        let l = await AsyncStorage.getItem("UserLocation");
        l = JSON.parse(l)
        let coords = { lat: l.coords.latitude, lng: l.coords.longitude}
        return coords
    }
    calculate_distance(start, current){
        let lat1 = start.lat;
        let lon1 = start.lng;
        let lat2 = current.lat;
        let lon2 = current.lng;

        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI/180; // φ, λ in radians
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const d = R * c; // in metres
         
        return d;
    }
}