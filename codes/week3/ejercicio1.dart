//ejercicio1: 
import 'dart:math';
import 'dart:io';

class Cilindro {
  final double radio;
  final double altura;

  Cilindro(this.radio, this.altura);

  double calcularArea() {
    return 2 * pi * radio * (radio + altura);
  }

  double calcularVolumen() {
    return pi * pow(radio, 2) * altura;
  }
}

void main() {
  print("Calculadora de cilindros");
  print("------------------------");

  stdout.write("Ingrese el radio del cilindro: ");
  String? inputRadio = stdin.readLineSync();

  stdout.write("Ingrese la altura del cilindro: ");
  String? inputAltura = stdin.readLineSync();

  double radio = double.parse(inputRadio!);
  double altura = double.parse(inputAltura!);

  Cilindro cilindro = Cilindro(radio, altura);

  double area = cilindro.calcularArea();
  double volumen = cilindro.calcularVolumen();

  print("\nResultados:");
  print("Área total: ${area.toStringAsFixed(2)} unidades cuadradas");
  print("Volumen: ${volumen.toStringAsFixed(2)} unidades cúbicas");
}
