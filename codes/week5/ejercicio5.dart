import 'dart:io';

void main() {
  stdout.write("Ingrese el tamaño de la matriz (NxN): ");
  int n = int.parse(stdin.readLineSync()!);

  // Crear matrices NxN llenas de ceros
  List<List<int>> matrixA = List.filled(n, List.filled(n, 0));
  List<List<int>> matrixB = List.filled(n, List.filled(n, 0));

  // Solicitar elementos para la matriz A
  print("Ingrese los elementos para la matriz A:");
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      stdout.write("Elemento A[$i,$j]: ");
      matrixA[i][j] = int.parse(stdin.readLineSync()!);
    }
  }

  // Solicitar elementos para la matriz B
  print("Ingrese los elementos para la matriz B:");
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      stdout.write("Elemento B[$i,$j]: ");
      matrixB[i][j] = int.parse(stdin.readLineSync()!);
    }
  }

  // Sumar las matrices
  List<List<int>> resultMatrix = List.filled(n, List.filled(n, 0));
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      resultMatrix[i][j] = matrixA[i][j] + matrixB[i][j];
    }
  }

  // Mostrar resultados
  print("\nMatriz A:");
  for (var row in matrixA) print(row);

  print("\nMatriz B:");
  for (var row in matrixB) print(row);

  print("\nMatriz Resultante (Suma de A y B):");
  for (var row in resultMatrix) print(row);
}
