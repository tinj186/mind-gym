with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'r') as f:
    content = f.read()

old_v1_steps = """            steps: [
              { label: "Look at the beaker. What number does the liquid reach?", expectedAnswer: valueStr },
              { label: "Write the volume with the correct unit symbol for millilitres:", expectedAnswer: "ml", acceptedAnswers: ["mL"] }
            ]"""

new_v1_steps = """            steps: [
              { label: "Look at the beaker. What number does the liquid reach?", expectedAnswer: valueStr },
              { label: "Write the volume with the correct unit symbol for millilitres:", expectedAnswer: valueStr + " ml", acceptedAnswers: [valueStr + "ml", valueStr + " mL", valueStr + "mL"] }
            ]"""

content = content.replace(old_v1_steps, new_v1_steps)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'w') as f:
    f.write(content)

print("Done")
