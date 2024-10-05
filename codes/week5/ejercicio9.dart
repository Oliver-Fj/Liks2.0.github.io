import 'dart:io';

void main() {
  // Solicitar al usuario que ingrese la base y el exponente
  stdout.write("Ingrese la base: ");
  double base = double.parse(stdin.readLineSync()!);
  
  stdout.write("Ingrese el exponente: ");
  int exponent = int.parse(stdin.readLineSync()!);

  // Calcular la potencia usando multiplicación repetida
  double result = calculatePower(base, exponent);

  // Mostrar el resultado
  print("$base elevado a la $exponent es igual a $result");
}

double calculatePower(double base, int exponent) {
  double result = 1.0;
  int absExponent = exponent.abs(); // Tomar el valor absoluto del exponente

  for (int i = 0; i < absExponent; i++) {
    result *= base; // Multiplicación repetida
  }

  // Si el exponente es negativo, calcular la potencia inversa
  if (exponent < 0) {
    return 1 / result;
  }

  return result;
}
