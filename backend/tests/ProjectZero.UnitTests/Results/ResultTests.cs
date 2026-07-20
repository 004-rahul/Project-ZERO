using ProjectZero.SharedKernel.Results;
using Xunit;

namespace ProjectZero.UnitTests.Results;

public class ResultTests
{
    [Fact]
    public void Success_ShouldBeSuccessful_AndCarryNoError()
    {
        var result = Result.Success();

        Assert.True(result.IsSuccess);
        Assert.False(result.IsFailure);
        Assert.Equal(Error.None, result.Error);
    }

    [Fact]
    public void Failure_ShouldCarryTheError()
    {
        var error = Error.NotFound("Organization");

        var result = Result.Failure(error);

        Assert.True(result.IsFailure);
        Assert.Equal("not_found", result.Error.Code);
    }

    [Fact]
    public void SuccessWithValue_ShouldExposeTheValue()
    {
        var result = Result.Success(42);

        Assert.True(result.IsSuccess);
        Assert.Equal(42, result.Value);
    }

    [Fact]
    public void AccessingValueOfFailure_ShouldThrow()
    {
        var result = Result.Failure<int>(Error.Validation("bad input"));

        Assert.Throws<InvalidOperationException>(() => result.Value);
    }
}
