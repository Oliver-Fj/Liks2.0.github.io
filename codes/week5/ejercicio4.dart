import 'dart:io';

void main() {
  // Solicitar al usuario que ingrese un número entero
  stdout.write("Ingrese un número entero: ");
  String? input = stdin.readLineSync();

  if (input != null) {
    // Convertir el número a un entero
    int number = int.parse(input);
    int originalNumber = number;
    int invertedNumber = 0;

    // Bucle while para invertir los dígitos
    while (number != 0) {
      int digit = number % 10; // Extraer el último dígito
      invertedNumber = invertedNumber * 10 + digit; // Reordenar los dígitos
      number ~/= 10; // Eliminar el último dígito
    }

    // Mostrar el resultado
    print("El número original es: $originalNumber");
    print("El número invertido es: $invertedNumber");
  } else {
    print("Entrada no válida.");
  }
}
