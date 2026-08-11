/**
 * BarModelBuilder
 * 
 * A utility class to standardize the generation of Bar Model visualEngine JSON payloads.
 * This decouples the structural definition of Bar Models from the LLM, ensuring strict
 * structural integrity (preventing hallucinations like missing brackets or extra segments).
 */
export class BarModelBuilder {
  /**
   * Creates a COMPARISON bar model configuration.
   * @param {Object} params
   * @param {Object} params.bar1 - Configuration for the first bar (e.g. { name: "A", value: "?", layoutSize: "1" })
   * @param {Object} params.bar2 - Configuration for the second bar (e.g. { name: "B", segments: "4", value: "?" })
   * @param {String|Number} params.whole - The total bracket value (e.g. "?" or "100")
   * @param {String} params.className - Tailwind classes for the wrapper container (default: "w-full max-w-4xl mx-auto")
   * @param {Boolean} params.isStatic - Whether the bar model is non-interactive (default: false)
   * @returns {Object} visualEngine object
   */
  static createComparison({ bar1, bar2, whole, className = "w-full max-w-4xl mx-auto", isStatic = false }) {
    return {
      componentToRender: "BAR_MODEL",
      componentData: {
        modelType: "COMPARISON",
        whole,
        bar1,
        bar2,
        className,
        isStatic
      }
    };
  }

  /**
   * Creates a PART_WHOLE bar model configuration.
   * @param {Object} params
   * @param {Array<Object>} params.parts - Array of part objects (e.g. [{ value: "50" }, { value: "?", group: "Diff" }])
   * @param {String|Number} params.whole - The total bracket value
   * @param {String} params.className - Tailwind classes for the wrapper container
   * @param {Boolean} params.isStatic - Whether the bar model is non-interactive
   * @returns {Object} visualEngine object
   */
  static createPartWhole({ parts, whole, className = "w-full max-w-4xl mx-auto", isStatic = false }) {
    return {
      componentToRender: "BAR_MODEL",
      componentData: {
        modelType: "PART_WHOLE",
        parts,
        whole,
        className,
        isStatic
      }
    };
  }

  /**
   * Creates a STACKED bar model configuration (used for complex comparisons/additions).
   * @param {Object} params
   * @param {Array<Object>} params.rows - Array of rows, each containing a 'name' and 'parts' array
   * @param {String|Number} params.whole - The total bracket value
   * @param {String} params.className - Tailwind classes for the wrapper container
   * @param {Boolean} params.isStatic - Whether the bar model is non-interactive
   * @returns {Object} visualEngine object
   */
  static createStacked({ rows, whole, className = "w-full max-w-2xl mx-auto", isStatic = false }) {
    return {
      componentToRender: "BAR_MODEL",
      componentData: {
        modelType: "STACKED",
        rows,
        whole,
        className,
        isStatic
      }
    };
  }
}
