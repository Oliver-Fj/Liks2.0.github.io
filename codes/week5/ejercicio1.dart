import 'dart:io';

void main() {
  print("Programa para calcular la sumatoria de números primos en un rango");
  print("------------------------------------------------------------------");

  // Solicitar dos números al usuario
  stdout.write("Ingrese el primer número del rango: ");
  String? inputStart = stdin.readLineSync();
  int start = int.parse(inputStart!);

  stdout.write("Ingrese el segundo número del rango: ");
  String? inputEnd = stdin.readLineSync();
  int end = int.parse(inputEnd!);

  // Verificar si el primer número es mayor o igual al segundo
  if (start >= end) {
    print("El primer número debe ser menor que el segundo.");
    return;
  }

  // Variable para almacenar la sumatoria de números primos
  int primeSum = 0;

  // Iterar desde el primer número hasta el último número
  for (int num = start + 1; num <= end; num++) {
    // Verificar si el número es primo
    bool isPrime = true;
    for (int i = 2; i < num; i++) {  // Cambiamos i <= sqrt(num) a i < num
      if (num % i == 0) {
        isPrime = false;
        break;
      }
    }

    // Si el número es primo, agregarlo a la sumatoria
    if (isPrime) {
      primeSum += num;
    }
  }

  // Mostrar el resultado
  print("\nResultados:");
  print("------------");
  print("Sumatoria de números primos en el rango ${start} a ${end}: $primeSum");

  // Opcional: Mostrar los números primos encontrados
  print("\nNúmeros primos encontrados en el rango:");
  for (int num = start + 1; num <= end; num++) {
    if (isPrime(num)) {
      print("$num ");
    }
  }
}

// Función auxiliar para verificar si un número es primo
bool isPrime(int n) {
  if (n <= 1) return false;
  for (int i = 2; i < n; i++) {
    if (n % i == 0) return false;
  }
  return true;
}
