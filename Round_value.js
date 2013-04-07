var UnitValue = "100";
var Round_Value = Round(value,UnitValue);

function Round(value,unit)
	{
	var CutUnit = unit;
	var Round = value * unit;
	Round = Math.round(Round);
	value = Round / unit;
	return value;
	}