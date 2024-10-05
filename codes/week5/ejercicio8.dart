import 'dart:io';
import 'dart:math';

void main() {
  // Solicitar al usuario que ingrese un número
  stdout.write("Ingrese un número entero: ");
  String? input = stdin.readLineSync();

  if (input != null && input.isNotEmpty) {
    // Convertir la entrada a un entero
    int number = int.parse(input);
    int originalNumber = number;

    // Obtener la cantidad de dígitos
    int digits = input.length;

    int sum = 0;

    // Bucle para calcular la suma de cada dígito elevado a la potencia de la cantidad de dígitos
    for (int i = 0; i < digits; i++) {
      int digit = int.parse(input[i]);
      sum += pow(digit, digits).toInt();
    }

    // Verificar si el número es un número de Armstrong
    if (sum == originalNumber) {
      print("$originalNumber es un número de Armstrong.");
    } else {
      print("$originalNumber no es un número de Armstrong.");
    }
  } else {
    print("Entrada no válida.");
  }
}
