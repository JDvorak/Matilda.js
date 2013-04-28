var weightedRandom = function(weights, sum) {
  var sample = sum * Math.random(),
           i = 0;

  sample -= weights[i];

  while (sample > 0.0) {
    i++;
    sample -= weights[i];
  }
  return i;
};


var emptyMatrix = function(height, width) {
  var height = height,
      width = width || height, 
      newMatrix = []; 

  for (var t1 = 0; t1 < height; t1++) {
    newMatrix[t1] = [];
    for (var t2 = 0; t2 < width; t2++) {
      newMatrix[t1][t2] = 0.0;
    }
  }

  return newMatrix;
}


var matrixEach = function(matrix, callback, context) {
  var len = matrix.length;
  for (var t1 = 0; t1 < len; t1++) {
    for (var t2 = 0; t2 < len; t2++) {
      callback.call(context, t1, t2, matrix)
    }  
  }
}