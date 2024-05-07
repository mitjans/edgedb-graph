with
  result := ext::ai::search(
    Function, <array<float32>><json>$query
  )
  select result.object {
    id,
    expression,
    distance := result.distance,
  }
  order by
    result.distance asc empty last
    then result.object.expression
  limit 5;
