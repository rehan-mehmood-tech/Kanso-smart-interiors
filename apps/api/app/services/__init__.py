"""Domain services.

Where the next slices land:
  storage.py    signed-URL access to the private room-photos / generated-designs buckets
  projects.py   project + wall-photo state transitions
  generation.py orchestration: Gemini reads the four walls -> Flux renders concepts
  ai/           provider adapters behind one generate_designs(input) interface
"""
