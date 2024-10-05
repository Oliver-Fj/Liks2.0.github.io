void main() {
  // Tamaño de la matriz
  int n = 5; // Puedes cambiar este valor para matrices de diferentes tamaños
  List<List<int>> matrix = List.generate(n, (i) => List.filled(n, 0));

  // Llenar la matriz en forma espiral
  fillMatrixSpiral(matrix, n);
  
  // Imprimir la matriz
  printMatrix(matrix);
}

void fillMatrixSpiral(List<List<int>> matrix, int n) {
  int left = 0, right = n - 1, top = 0, bottom = n - 1;
  int num = 1;

  while (left <= right && top <= bottom) {
    // Llenar la fila superior
    for (int i = left; i <= right; i++) {
      matrix[top][i] = num++;
    }
    top++;

    // Llenar la columna derecha
    for (int i = top; i <= bottom; i++) {
      matrix[i][right] = num++;
    }
    right--;

    // Llenar la fila inferior
    if (top <= bottom) {
      for (int i = right; i >= left; i--) {
        matrix[bottom][i] = num++;
      }
      bottom--;
    }

    // Llenar la columna izquierda
    if (left <= right) {
      for (int i = bottom; i >= top; i--) {
        matrix[i][left] = num++;
      }
      left++;
    }
  }
}

void printMatrix(List<List<int>> matrix) {
  for (var row in matrix) {
    print(row);
  }
}
