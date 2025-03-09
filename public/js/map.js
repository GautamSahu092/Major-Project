mapboxgl.accessToken = mapToken;

            const map = new mapboxgl.Map({
                // console.log(mapToken);
                container: 'map', // container ID
                center:coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
                zoom: 9 // starting zoom
            });

            const marker1 = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }) // ✅ Fixed function name
                .setHTML(`<h3>${title}</h3><p>Exact location will be provided after booking!</p>`))
            .addTo(map);