import 'dart:io';

void main() {
  print("Programa para calcular el factorial de números grandes");
  print("--------------------------------------------------------");

  // Solicitar el número al usuario
  stdout.write("Ingrese el número para calcular su factorial: ");
  String? inputNumber = stdin.readLineSync();
  BigInt number = BigInt.parse(inputNumber!);

  // Calcular el factorial
  BigInt factorial = calculateFactorial(number);

  // Mostrar el resultado
  print("\nResultado:");
  print("Factorial de $number es: $factorial");

  // Opción para calcular factoriales de múltiples números
  print("\n¿Desea calcular factoriales de múltiples números?");
  print("1. Sí, calcular varios números");
  print("2. No, terminar el programa");

  stdout.write("Seleccione una opción (1-2): ");
  String? optionInput = stdin.readLineSync();
  int option = int.parse(optionInput!);

  if (option == 1) {
    while (true) {
      stdout.write("Ingrese otro número (0 para terminar): ");
      String? inputNumberMultiple = stdin.readLineSync();
      if (inputNumberMultiple == null || inputNumberMultiple.isEmpty) break;
      BigInt numberMultiple = BigInt.parse(inputNumberMultiple);
      
      BigInt factorialMultiple = calculateFactorial(numberMultiple);
      print("Factorial de $numberMultiple es: $factorialMultiple");
    }
  }
}

// Función auxiliar para calcular el factorial
BigInt calculateFactorial(BigInt n) {
  int resultInt = 1;
  for (int i = 2; i <= n.toInt(); i++) {
    resultInt *= i;
  }
  return BigInt.from(resultInt);
}
