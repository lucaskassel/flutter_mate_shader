import 'dart:ui';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Mate Shader',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const Mate(),
    );
  }
}

class Mate extends StatefulWidget {
  const Mate({super.key});

  @override
  State<Mate> createState() => _MateState();
}

class _MateState extends State<Mate> with TickerProviderStateMixin {
  late final AnimationController _controller;
  late AnimationController _pulse;
  late Tween<double> _intensityTween;
  late double _currentIntensity; // Initial intensity value when tapped
  final double _minIntensity = 0.5;
  final double _maxIntensity = 2.5;

  int _startTime = 0;
  double get _elapsedTimeInSeconds =>
      (_startTime - DateTime.now().millisecondsSinceEpoch) / 1000;

  double get _sideLength =>
      MediaQuery.of(context).size.width < MediaQuery.of(context).size.height
          ? MediaQuery.of(context).size.width
          : MediaQuery.of(context).size.height;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 10),
      vsync: this,
    )..repeat();

    _pulse = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _currentIntensity = _minIntensity;
    _intensityTween =
        Tween<double>(begin: _currentIntensity, end: _maxIntensity);

    // Add a status listener to detect when the animation completes
    _pulse.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        if (_currentIntensity == _maxIntensity) {
          _intensityTween.begin = _maxIntensity;
          _intensityTween.end = _minIntensity;
          _pulse.reset();
          _pulse.forward();
        }
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void pulse() {
    _intensityTween.begin = _currentIntensity;
    _intensityTween.end = _maxIntensity;

    _pulse.reset();
    _pulse.forward();
    _pulse.addListener(() {
      setState(() {
        _currentIntensity = _intensityTween.evaluate(_pulse);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            SizedBox(
              width: MediaQuery.of(context).size.width,
              height: MediaQuery.of(context).size.height,
              child: AspectRatio(
                aspectRatio: 1.0, // Aspect ratio of 1:1 for a square
                child: FutureBuilder<FragmentShader>(
                    future: _load(),
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        final shader = snapshot.data!;
                        if (_startTime == 0) {
                          _startTime = DateTime.now().millisecondsSinceEpoch;
                        }
                        shader.setFloat(1, _sideLength); //width
                        shader.setFloat(2, _sideLength); //height
                        return AnimatedBuilder(
                            animation: _controller,
                            builder: (context, _) {
                              shader.setFloat(0, _elapsedTimeInSeconds);
                              shader.setFloat(3, _currentIntensity);
                              return GestureDetector(
                                // Add GestureDetector here
                                onTap: pulse,
                                child: CustomPaint(
                                  painter: ShaderPainter(shader),
                                ),
                              );
                            });
                      } else {
                        return const CircularProgressIndicator();
                      }
                    }),
              ),
            )
          ],
        ),
      ),
    );
  }
}

class ShaderPainter extends CustomPainter {
  final FragmentShader shader;

  ShaderPainter(this.shader);

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawRect(
      Rect.fromLTWH(0, 0, size.width, size.height),
      Paint()..shader = shader,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return oldDelegate != this;
  }
}

Future<FragmentShader> _load() async {
  FragmentProgram program =
      await FragmentProgram.fromAsset('shaders/mate.frag');
  final shader = program.fragmentShader();

  return shader;
}
