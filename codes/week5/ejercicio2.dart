import 'dart:io';

void main() {
  print("Programa para generar la secuencia de Fibonacci");
  print("------------------------------------------------");

  // Solicitar el número de términos al usuario
  stdout.write("Ingrese el número de términos: ");
  String? inputTerms = stdin.readLineSync();
  int terms = int.parse(inputTerms!);

  // Generar la secuencia de Fibonacci
  List<int> fibonacciSequence = generateFibonacciSequence(terms);

  // Mostrar la secuencia
  print("\nSecuencia de Fibonacci:");
  print(fibonacciSequence.join(' '));

  // Opción para mostrar información adicional
  print("\n¿Desea ver información adicional sobre la secuencia?");
  print("1. Término más grande");
  print("2. Término más pequeño");
  print("3. Promedio de la secuencia");
  print("4. Salir");

  stdout.write("Seleccione una opción (1-4): ");
  String? optionInput = stdin.readLineSync();
  int option = int.parse(optionInput!);

  switch (option) {
    case 1:
      print("Término más grande: ${fibonacciSequence.last}");
      break;
    case 2:
      print("Término más pequeño: ${fibonacciSequence.first}");
      break;
    case 3:
      double average = fibonacciSequence.reduce((a, b) => a + b) / terms;
      print("Promedio de la secuencia: $average");
      break;
    case 4:
      print("Gracias por usar el programa.");
      break;
    default:
      print("Opción inválida. Gracias por usar el programa.");
  }
}

// Función auxiliar para generar la secuencia de Fibonacci
List<int> generateFibonacciSequence(int n) {
  List<int> sequence = [0, 1];
  
  while (sequence.length < n) {
    int nextTerm = sequence.last + sequence[sequence.length - 2];
    sequence.add(nextTerm);
  }

  return sequence;
}
