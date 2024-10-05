void main() {
  print("Números perfectos entre 1 y 10,000:");

  for (int i = 1; i <= 10000; i++) {
    if (isPerfect(i)) {
      print(i);
    }
  }
}

bool isPerfect(int number) {
  int sumOfDivisors = 0;

  // Encontrar divisores propios del número
  for (int j = 1; j < number; j++) {
    if (number % j == 0) {
      sumOfDivisors += j; // Sumar el divisor propio
    }
  }

  // Un número es perfecto si la suma de sus divisores propios es igual al número
  return sumOfDivisors == number;
}
