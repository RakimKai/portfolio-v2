/**
 * A cat the way a PlayStation 1 game would have had one: flat polygons, three
 * shades, no curves. The two pairs of legs swing out of phase and the body bobs
 * with them, so it runs on the spot.
 */
export function Cat({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 128 68"
      className={className}
      style={style}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <g fill="currentColor">
        {/* tail — two facets, so it folds rather than bends */}
        <g className="cat-tail">
          <polygon points="20,42 8,34 4,22 11,23 14,33 24,38" opacity="0.62" />
          <polygon points="11,23 4,22 6,14 13,16" opacity="0.85" />
        </g>

        <g className="cat-body">
          {/* haunch */}
          <polygon points="18,44 22,26 40,22 44,46" opacity="0.72" />
          {/* flank, the big lit face */}
          <polygon points="40,22 74,24 78,46 44,46" />
          {/* shoulder, turning away from the light */}
          <polygon points="74,24 90,30 92,46 78,46" opacity="0.72" />
          {/* neck — carries the flank up into the jaw with no gap */}
          <polygon points="84,26 100,17 102,38 88,42" opacity="0.86" />

          {/* head: crown, then the muzzle turning away */}
          <polygon points="98,15 119,11 125,26 112,36 99,32" />
          <polygon points="112,36 125,26 127,33 116,41" opacity="0.7" />
          <polygon points="99,32 112,36 111,40 100,37" opacity="0.5" />

          {/* ears, sitting on the crown */}
          <polygon points="100,16 97,3 110,12" opacity="0.88" />
          <polygon points="115,11 122,2 125,15" opacity="0.88" />

          {/* eye, cut out of the head rather than drawn on it */}
          <polygon points="112,19 119,18 118,23 111,24" opacity="0.22" />
        </g>

        {/* legs: quads, so they keep their width as they swing */}
        <g className="cat-leg cat-leg-a">
          <polygon points="26,42 34,42 33,64 27,64" opacity="0.62" />
        </g>
        <g className="cat-leg cat-leg-b">
          <polygon points="38,42 46,42 45,64 39,64" opacity="0.86" />
        </g>
        <g className="cat-leg cat-leg-b">
          <polygon points="70,42 78,42 77,64 71,64" opacity="0.62" />
        </g>
        <g className="cat-leg cat-leg-a">
          <polygon points="82,42 90,42 89,64 83,64" opacity="0.86" />
        </g>
      </g>
    </svg>
  );
}
