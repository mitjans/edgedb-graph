with
  result := ext::ai::search(
    Function, <array<float32>><json>$query
  )
  select result.object {
    id,
    expression,
    distance := result.distance,
  }
  filter
    result.distance < 0.5 and result.distance > 0.001
  order by
    result.distance asc empty last
    then result.object.expression
  limit 5;
