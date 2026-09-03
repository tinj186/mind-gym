import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/VolumeBeaker.jsx', 'r') as f:
    content = f.read()

# Add labelInterval to props
old_props = """    color = '#3b82f6', // blue-500
    intervals = 1,
    label,
  } = data || {};"""

new_props = """    color = '#3b82f6', // blue-500
    intervals = 1,
    labelInterval,
    label,
  } = data || {};"""

content = content.replace(old_props, new_props)

# Update tick rendering
old_ticks = """          {ticks.map((tick, i) => {
            const yPos = liquidMaxHeight - (tick.value / maxScale) * liquidMaxHeight;
            return (
              <div key={i} className="absolute flex items-center" style={{ top: `${yPos}px`, left: '0', transform: 'translateY(-50%)' }}>
                <div className="w-6 h-1 bg-slate-800 rounded-r-full z-10" />
                <div className="ml-1 text-sm font-bold text-slate-800 drop-shadow-md bg-white/60 px-1 rounded">
                  {tick.value}{unit}
                </div>
              </div>
            );
          })}"""

new_ticks = """          {ticks.map((tick, i) => {
            const yPos = liquidMaxHeight - (tick.value / maxScale) * liquidMaxHeight;
            const showLabel = labelInterval ? tick.value % labelInterval === 0 : true;
            return (
              <div key={i} className="absolute flex items-center" style={{ top: `${yPos}px`, left: '0', transform: 'translateY(-50%)' }}>
                <div className="w-6 h-1 bg-slate-800 rounded-r-full z-10" />
                {showLabel && (
                  <div className="ml-1 text-sm font-bold text-slate-800 drop-shadow-md bg-white/60 px-1 rounded">
                    {tick.value}{unit}
                  </div>
                )}
              </div>
            );
          })}"""

content = content.replace(old_ticks, new_ticks)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/VolumeBeaker.jsx', 'w') as f:
    f.write(content)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'r') as f:
    f_content = f.read()

# Add liquid variables and labelInterval
old_v1_visual = """      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: maxScale,
          intervals: intervals,
          value: value,
          unit: "ml",
          color: "#3b82f6"
        }
      });"""

new_v1_visual = """      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: maxScale,
          intervals: intervals,
          labelInterval: intervals * 2,
          value: value,
          unit: "ml",
          color: "#3b82f6"
        }
      });"""
f_content = f_content.replace(old_v1_visual, new_v1_visual)

old_v1_structText = "let structText = `STORY: ${names[0]} pours some sirap bandung into a beaker. Look at the visual model. What is the volume of the drink?`;"
new_v1_structText = "const LIQUIDS = ['sirap bandung', 'iced Milo', 'lemonade', 'orange juice', 'soya bean milk', 'milk', 'apple juice']; const liquid1 = LIQUIDS[Math.floor(Math.random() * LIQUIDS.length)];\n        let structText = `STORY: ${names[0]} pours some ${liquid1} into a beaker. Look at the visual model. What is the volume of the drink?`;"
f_content = f_content.replace(old_v1_structText, new_v1_structText)

# V2 update
old_v2_visual = """      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: maxScale,
          intervals: intervals,
          value: value,
          unit: "ml",
          color: "#8b5cf6" // A different color like grape juice
        }
      });"""

new_v2_visual = """      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: maxScale,
          intervals: intervals / 2,
          labelInterval: intervals,
          value: value,
          unit: "ml",
          color: "#8b5cf6" // A different color like grape juice
        }
      });"""
f_content = f_content.replace(old_v2_visual, new_v2_visual)

old_v2_structText = "let structText = `STORY: ${names[1]} is making iced Milo. The water level in his beaker is exactly halfway between ${lowerTick} ml and ${upperTick} ml. What is the volume?`;"
new_v2_structText = "const liquid2 = LIQUIDS[Math.floor(Math.random() * LIQUIDS.length)];\n        let structText = `STORY: ${names[1]} is making ${liquid2}. The liquid level in his beaker is exactly halfway between ${lowerTick} ml and ${upperTick} ml. What is the volume?`;"
f_content = f_content.replace(old_v2_structText, new_v2_structText)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'w') as f:
    f.write(f_content)

print("Done")
