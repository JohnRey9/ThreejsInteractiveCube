function getPointTexture() {
  let thePointTexture = null;
  if (!thePointTexture) {
    const aPointImage = new Image();
    aPointImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABj1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAAAFBQUAAAD09PT5+fkAAAAAAAD09PQAAAAAAAAAAAAAAAAAAAAAAADq6uri4uKwsLDl5eUrKyvX19cAAAAAAAAAAAAAAAAAAAAAAAAAAAAKCgoAAABXV1f8/Pzf39/d3d3U1NT09PTOzs7m5ubu7u5kZGTf3989PT0cHBzCwsIPDw/Dw8M/Pz8AAACmpqZOTk4AAABwcHAAAAACAgIAAAAAAAADAwMAAAAAAAAAAAA/Pz/o6OjIyMju7u69vb3y8vLW1taxsbGYmJiLi4uJiYnW1tbCwsKgoKCAgIDGxsZVVVWbm5uFhYWTk5NKSkrd3d3Hx8dycnKdnZ1BQUGurq6kpKQhISE2NjZycnKhoaEPDw9ISEg7Ozt6enoQEBBdXV0oKCi3t7eUlJRiYmIAAAAZGRkcHBxiYmIAAACdnZ1XV1ePj490dHRfX19ISEgqKipoaGhsbGxubm4wMDAzMzM5OTn////9/f1W4ywZAAAAg3RSTlMABAIJDBcRIj0UODUeUBv++iol/H5gTkoxKP3z7+XIxqmjnZKGc25fRkH++/f38/Du7ODdysW7u6efi4eBenFxa2hnZFtSLiz79vX19PTy7ezq5+bj4+Ha2NbU1NLSzcTEwb+4t7WxsbCrqKimpZ6enpeNh4KAdnRuaWhbWlhQTEo3MRDaXZsAAAHWSURBVDjLfZN3U9tAFMSRr6slknuMbdzthIReA6GT3nvvvfeEDuKD8w4bCeEb9r+b/b3dm7l3HWFFpPxTm6ntSQWBizAVhBBBMQqQwMbCdhd1neuGwwgFJOwjam7++5LPZgeGv/5N6i7BULTPx2TrT77v0lHP245eyD6fSBhsNyTwG6N94EpJ5saHOHcF0vx8sp4/5e3T8czTmbpLWxERJBqjrXE/JPN6hjMsCVlw9rQ/72f0jMV1AiUygKw98toUvRez0lDSDAgKgpLL72chQgKiMewpdO5JLAm3kA2rAyogeqs071CtQ0Pmf2hQdPQUZw0BAGZnPKVOdlV1cjhQ4U1gqVflH+nsmpIJEWQuP1YBx24XppuAvfFGBZx4+D2eogBowvjVq2oYKVsulgBNr7xQBNwtTHFbPoaGbD5xp+0G10fG5xcFvIWMcKxvmQMFV4aKVW5CAwj2xah9uhmav5YrTCbkY7Y2zuRzYw+6/fGL/UPFyYUUCXaOMl77+e5+Zze456/2596WKlaKyIXyCdOwpn98fvVscDD38mMpFq874If33uELc5Xf5fFyrFpLGkwg8MM/x04bPJmwEnWeYgSD3/41hW0yxkwiAjuMAANCSNMCfweGluQcLZz7AQAAAABJRU5ErkJggg==';
    thePointTexture = new THREE.Texture();
    thePointTexture.image = aPointImage;
    thePointTexture.needsUpdate = true;
    thePointTexture.repeat.set(1, 1);
    thePointTexture.wrapS = THREE.RepeatWrapping;
    thePointTexture.wrapT = THREE.RepeatWrapping;
  }
  return thePointTexture;
}

const POINT_MATERIAL = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        size: 15,
        sizeAttenuation: false,
        map: getPointTexture(),
        transparent: true
      }),

      LINE_MATERIAL = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 3 } );



class ThreejsInteractiveCube extends THREE.Group {
  constructor(theRandomPosition = false, theSize = 100) {
    super();

    const aCubeVertices = [];
  
    //set points of vertices
    aCubeVertices.push(new THREE.Vector3(-theSize, theSize, theSize));
    aCubeVertices.push(new THREE.Vector3(theSize, theSize, theSize));
    aCubeVertices.push(new THREE.Vector3(theSize, -theSize, theSize));
    aCubeVertices.push(new THREE.Vector3(-theSize, -theSize, theSize));
  
    aCubeVertices.push(new THREE.Vector3(-theSize, theSize, -theSize));
    aCubeVertices.push(new THREE.Vector3(theSize, theSize, -theSize));
    aCubeVertices.push(new THREE.Vector3(theSize, -theSize, -theSize));
    aCubeVertices.push(new THREE.Vector3(-theSize, -theSize, -theSize));
    

    //set colors of vertices
    const aPointColors  = new Float32Array(aCubeVertices.length * 3);
    let aColor = new THREE.Color();

    for (let i = 0, l = aCubeVertices.length; i < l; i++) {
      aColor.setRGB(Math.random(), i / l, i / l);
      aColor.toArray(aPointColors, i * 3);
    }

    //create point geometry
    const aPointGeometry = new THREE.BufferGeometry().setFromPoints(aCubeVertices);
    aPointGeometry.addAttribute('color', new THREE.BufferAttribute(aPointColors, 3));
    this.vertices = new THREE.Points(aPointGeometry, POINT_MATERIAL);
  

    //create line geometry
    const aLineGeometry = new THREE.BufferGeometry().setFromPoints(aCubeVertices);
    aLineGeometry.setIndex([0, 1,  1, 2,  2, 3,  3, 0,    4, 5,  5, 6,  6, 7,  7, 4,    0, 4,  1, 5,  2, 6,  3, 7]);
    this.edges = new THREE.LineSegments(aLineGeometry, LINE_MATERIAL);
  
  
    this.add(this.vertices);
    this.add(this.edges);


    if (theRandomPosition) {
      this.position.x = Math.random() * 800 - 400;
      this.position.y = Math.random() * 800 - 400;
      this.position.z = Math.random() * 800 - 400;

      this.rotation.x = Math.random() * 2 * Math.PI;
      this.rotation.y = Math.random() * 2 * Math.PI;
      this.rotation.z = Math.random() * 2 * Math.PI;
    }

    this.selectedEdges;
  }

  _findRelatedVertices(theVertexIndex) {
    let aRelatedVertices = [];

    aRelatedVertices.push(theVertexIndex);
  
    if (theVertexIndex >= 0 && theVertexIndex <= 3) {
  
      if (theVertexIndex + 1 === 4) {
        aRelatedVertices.push(0);
      } else {
        aRelatedVertices.push(theVertexIndex + 1);
      }
  
      if (theVertexIndex - 1 === -1) {
        aRelatedVertices.push(3);
      } else {
        aRelatedVertices.push(theVertexIndex - 1);
      }
  
      aRelatedVertices.push(theVertexIndex + 4);
  
    } else {
  
      if (theVertexIndex + 1 === 8) {
        aRelatedVertices.push(4);
      } else {
        aRelatedVertices.push(theVertexIndex + 1);
      }
  
      if (theVertexIndex - 1 === 3) {
        aRelatedVertices.push(7);
      } else {
        aRelatedVertices.push(theVertexIndex - 1);
      }
  
      aRelatedVertices.push(theVertexIndex - 4);
  
    }

    return aRelatedVertices;
  }

  _edgesEqual(theRelatedVertices) {
    if (this.selectedEdges) {
      let aCheckOldSelection = true;

      this.selectedEdges.verticesArray.forEach((theEdge, theIndex) => {
        if (theRelatedVertices[theIndex] !== theEdge) {
          aCheckOldSelection = false;
        }
      });

      if (aCheckOldSelection) {
        return true;
      } else {
        return false;
      }
    }
  }

  deselectVertex() {
    if (this.selectedEdges) {
      this.remove(this.selectedEdges);
      this.selectedEdges = undefined;
    }
  }

  selectVertex(theVertexIndex) {
    let aRelatedVertices = this._findRelatedVertices(theVertexIndex);

    if (this._edgesEqual(aRelatedVertices)) {
      return;
    }
    this.deselectVertex();


    //find point coords of vertices
    const aVerticesCoords = this.edges.geometry.attributes.position.array;

    const aRelatedVerticesArray = aRelatedVertices.map(thePoint => {
      const anIndex = thePoint * 3;
      return new THREE.Vector3(
        aVerticesCoords[anIndex],
        aVerticesCoords[anIndex + 1],
        aVerticesCoords[anIndex + 2]);
    });
  
 
    //create line geometry
    const aLineGeometry = new THREE.BufferGeometry().setFromPoints(aRelatedVerticesArray);  
    aLineGeometry.setIndex([0, 1, 0, 2, 0, 3]);
  
    //create line material
    const aPointsColors = this.vertices.geometry.attributes.color.array,
          aLineColor = 
            new THREE.Color().setRGB(aPointsColors[theVertexIndex * 3], aPointsColors[theVertexIndex * 3 + 1], aPointsColors[theVertexIndex * 3 + 2])

    const aLineMaterial = new THREE.LineBasicMaterial({ color: aLineColor });



    this.selectedEdges = new THREE.LineSegments(aLineGeometry, aLineMaterial);
    this.selectedEdges.verticesArray = aRelatedVertices;

    this.add(this.selectedEdges);
  }

}